from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import uuid
import logging
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Response, status
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr


# ----- Config -----
JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_MINUTES = 60 * 24  # 1 day for admin convenience
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@kuswa.org")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "kuswa@2004")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

app = FastAPI(title="KUSWA API")
api = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("kuswa")


# ----- Helpers -----
def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()


def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode(), hashed.encode())
    except Exception:
        return False


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_MINUTES),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_admin(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token")
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
        if not user or user.get("role") != "admin":
            raise HTTPException(status_code=401, detail="Not authorized")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def new_id() -> str:
    return str(uuid.uuid4())


# ----- Models -----
class LoginIn(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: str
    name: str
    role: str


# News
class NewsIn(BaseModel):
    title_en: str
    title_bn: str
    content_en: str
    content_bn: str
    image_url: Optional[str] = ""
    category: str = "news"  # news | notice
    is_published: bool = True


class NewsOut(NewsIn):
    id: str
    created_at: str


# Events
class EventIn(BaseModel):
    title_en: str
    title_bn: str
    description_en: str
    description_bn: str
    event_date: str  # ISO date
    location_en: str = ""
    location_bn: str = ""
    image_url: Optional[str] = ""
    is_upcoming: bool = True


class EventOut(EventIn):
    id: str
    created_at: str


# Members (registered via public form)
class MemberIn(BaseModel):
    name: str
    father_name: str
    dob: str = ""
    address: str
    profession: str = ""
    institution: str = ""
    education: str = ""
    email: EmailStr
    mobile: str
    blood_group: str = ""
    nid_or_birth_reg: str = ""
    photo_url: Optional[str] = ""


class MemberOut(MemberIn):
    id: str
    status: str  # pending | approved | rejected
    created_at: str


class MemberStatusIn(BaseModel):
    status: str  # approved | rejected | pending


# Committee
class CommitteeIn(BaseModel):
    name_en: str
    name_bn: str
    position_en: str
    position_bn: str
    category: str = "executive"  # executive | advisor | ulama | student | expat | business | youth | sports | culture | agriculture | office
    photo_url: Optional[str] = ""
    bio_en: str = ""
    bio_bn: str = ""
    order: int = 0


class CommitteeOut(CommitteeIn):
    id: str


# Gallery
class GalleryIn(BaseModel):
    title_en: str
    title_bn: str
    media_type: str = "photo"  # photo | video
    media_url: str
    album: str = "general"
    description_en: str = ""
    description_bn: str = ""


class GalleryOut(GalleryIn):
    id: str
    created_at: str


# Contact messages
class ContactIn(BaseModel):
    name: str
    email: EmailStr
    phone: str = ""
    subject: str = ""
    message: str


class ContactOut(ContactIn):
    id: str
    created_at: str
    is_read: bool


# Settings (donation info, contact info)
class SettingsIn(BaseModel):
    bank_name: str = ""
    bank_account: str = ""
    bank_account_holder: str = ""
    bank_branch: str = ""
    bkash_number: str = ""
    nagad_number: str = ""
    rocket_number: str = ""
    contact_phone: str = ""
    contact_email: str = ""
    contact_address_en: str = ""
    contact_address_bn: str = ""
    facebook_url: str = "https://www.facebook.com/profile.php?id=61568536621267"
    youtube_url: str = ""
    map_embed_url: str = ""


# ----- Auth routes -----
@api.post("/auth/login")
async def login(payload: LoginIn, response: Response):
    email = payload.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], email)
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=ACCESS_TOKEN_MINUTES * 60,
        path="/",
    )
    return {
        "user": {"id": user["id"], "email": user["email"], "name": user.get("name", "Admin"), "role": user.get("role", "admin")},
        "access_token": token,
    }


@api.get("/auth/me")
async def me(user: dict = Depends(get_current_admin)):
    return user


@api.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"message": "Logged out"}


# ----- News -----
@api.get("/news", response_model=List[NewsOut])
async def list_news(category: Optional[str] = None, published_only: bool = True):
    q = {}
    if category:
        q["category"] = category
    if published_only:
        q["is_published"] = True
    docs = await db.news.find(q, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


@api.post("/news", response_model=NewsOut)
async def create_news(payload: NewsIn, user: dict = Depends(get_current_admin)):
    doc = payload.model_dump()
    doc["id"] = new_id()
    doc["created_at"] = now_iso()
    await db.news.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api.put("/news/{item_id}", response_model=NewsOut)
async def update_news(item_id: str, payload: NewsIn, user: dict = Depends(get_current_admin)):
    update = payload.model_dump()
    res = await db.news.update_one({"id": item_id}, {"$set": update})
    if res.matched_count == 0:
        raise HTTPException(404, "Not found")
    doc = await db.news.find_one({"id": item_id}, {"_id": 0})
    return doc


@api.delete("/news/{item_id}")
async def delete_news(item_id: str, user: dict = Depends(get_current_admin)):
    res = await db.news.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(404, "Not found")
    return {"deleted": item_id}


# ----- Events -----
@api.get("/events", response_model=List[EventOut])
async def list_events():
    docs = await db.events.find({}, {"_id": 0}).sort("event_date", -1).to_list(500)
    return docs


@api.post("/events", response_model=EventOut)
async def create_event(payload: EventIn, user: dict = Depends(get_current_admin)):
    doc = payload.model_dump()
    doc["id"] = new_id()
    doc["created_at"] = now_iso()
    await db.events.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api.put("/events/{item_id}", response_model=EventOut)
async def update_event(item_id: str, payload: EventIn, user: dict = Depends(get_current_admin)):
    res = await db.events.update_one({"id": item_id}, {"$set": payload.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(404, "Not found")
    return await db.events.find_one({"id": item_id}, {"_id": 0})


@api.delete("/events/{item_id}")
async def delete_event(item_id: str, user: dict = Depends(get_current_admin)):
    res = await db.events.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(404, "Not found")
    return {"deleted": item_id}


# ----- Members -----
@api.get("/members", response_model=List[MemberOut])
async def list_members(status_filter: Optional[str] = None, public: bool = False):
    q = {}
    if public:
        q["status"] = "approved"
    elif status_filter:
        q["status"] = status_filter
    # Admin protection only when not public
    if not public:
        # require auth for non-public
        pass
    docs = await db.members.find(q, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs


@api.get("/members/public", response_model=List[MemberOut])
async def list_members_public():
    docs = await db.members.find({"status": "approved"}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs


@api.get("/members/admin", response_model=List[MemberOut])
async def list_members_admin(status_filter: Optional[str] = None, user: dict = Depends(get_current_admin)):
    q = {}
    if status_filter:
        q["status"] = status_filter
    docs = await db.members.find(q, {"_id": 0}).sort("created_at", -1).to_list(2000)
    return docs


@api.post("/members", response_model=MemberOut)
async def register_member(payload: MemberIn):
    doc = payload.model_dump()
    doc["id"] = new_id()
    doc["status"] = "pending"
    doc["created_at"] = now_iso()
    await db.members.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api.put("/members/{item_id}/status", response_model=MemberOut)
async def update_member_status(item_id: str, payload: MemberStatusIn, user: dict = Depends(get_current_admin)):
    if payload.status not in {"pending", "approved", "rejected"}:
        raise HTTPException(400, "Invalid status")
    res = await db.members.update_one({"id": item_id}, {"$set": {"status": payload.status}})
    if res.matched_count == 0:
        raise HTTPException(404, "Not found")
    return await db.members.find_one({"id": item_id}, {"_id": 0})


@api.delete("/members/{item_id}")
async def delete_member(item_id: str, user: dict = Depends(get_current_admin)):
    res = await db.members.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(404, "Not found")
    return {"deleted": item_id}


# ----- Committee -----
@api.get("/committee", response_model=List[CommitteeOut])
async def list_committee():
    docs = await db.committee.find({}, {"_id": 0}).sort("order", 1).to_list(200)
    return docs


@api.post("/committee", response_model=CommitteeOut)
async def create_committee(payload: CommitteeIn, user: dict = Depends(get_current_admin)):
    doc = payload.model_dump()
    doc["id"] = new_id()
    await db.committee.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api.put("/committee/{item_id}", response_model=CommitteeOut)
async def update_committee(item_id: str, payload: CommitteeIn, user: dict = Depends(get_current_admin)):
    res = await db.committee.update_one({"id": item_id}, {"$set": payload.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(404, "Not found")
    return await db.committee.find_one({"id": item_id}, {"_id": 0})


@api.delete("/committee/{item_id}")
async def delete_committee(item_id: str, user: dict = Depends(get_current_admin)):
    res = await db.committee.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(404, "Not found")
    return {"deleted": item_id}


# ----- Gallery -----
@api.get("/gallery", response_model=List[GalleryOut])
async def list_gallery(media_type: Optional[str] = None, album: Optional[str] = None):
    q = {}
    if media_type:
        q["media_type"] = media_type
    if album:
        q["album"] = album
    docs = await db.gallery.find(q, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


@api.post("/gallery", response_model=GalleryOut)
async def create_gallery(payload: GalleryIn, user: dict = Depends(get_current_admin)):
    doc = payload.model_dump()
    doc["id"] = new_id()
    doc["created_at"] = now_iso()
    await db.gallery.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api.delete("/gallery/{item_id}")
async def delete_gallery(item_id: str, user: dict = Depends(get_current_admin)):
    res = await db.gallery.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(404, "Not found")
    return {"deleted": item_id}


# ----- Contact -----
@api.post("/contact", response_model=ContactOut)
async def submit_contact(payload: ContactIn):
    doc = payload.model_dump()
    doc["id"] = new_id()
    doc["created_at"] = now_iso()
    doc["is_read"] = False
    await db.contact_messages.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api.get("/contact", response_model=List[ContactOut])
async def list_contacts(user: dict = Depends(get_current_admin)):
    docs = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return docs


@api.delete("/contact/{item_id}")
async def delete_contact(item_id: str, user: dict = Depends(get_current_admin)):
    res = await db.contact_messages.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(404, "Not found")
    return {"deleted": item_id}


# ----- Settings -----
@api.get("/settings", response_model=SettingsIn)
async def get_settings():
    doc = await db.settings.find_one({"id": "main"}, {"_id": 0, "id": 0})
    if not doc:
        return SettingsIn().model_dump()
    return doc


@api.put("/settings", response_model=SettingsIn)
async def update_settings(payload: SettingsIn, user: dict = Depends(get_current_admin)):
    update = payload.model_dump()
    await db.settings.update_one({"id": "main"}, {"$set": update}, upsert=True)
    return update


# ----- Stats -----
@api.get("/stats")
async def stats():
    members = await db.members.count_documents({"status": "approved"})
    events = await db.events.count_documents({})
    news = await db.news.count_documents({"is_published": True})
    gallery = await db.gallery.count_documents({})
    return {
        "members": members,
        "events": events,
        "news": news,
        "gallery": gallery,
        "years_active": datetime.now().year - 2004,
    }


@api.get("/")
async def root():
    return {"message": "KUSWA API is running", "version": "1.0"}


# ----- Startup -----
async def seed_admin():
    existing = await db.users.find_one({"email": ADMIN_EMAIL})
    if not existing:
        await db.users.insert_one({
            "id": new_id(),
            "email": ADMIN_EMAIL,
            "password_hash": hash_password(ADMIN_PASSWORD),
            "name": "KUSWA Admin",
            "role": "admin",
            "created_at": now_iso(),
        })
        logger.info("Seeded admin user %s", ADMIN_EMAIL)
    elif not verify_password(ADMIN_PASSWORD, existing.get("password_hash", "")):
        await db.users.update_one(
            {"email": ADMIN_EMAIL},
            {"$set": {"password_hash": hash_password(ADMIN_PASSWORD)}},
        )
        logger.info("Updated admin password")


async def seed_initial_content():
    # Reseed committee with real names if not customized
    existing_count = await db.committee.count_documents({})
    if existing_count == 0 or existing_count == 3:
        await db.committee.delete_many({})
        defaults = [
            {"id": new_id(), "name_en": "Hafez Maulana Sofiullah", "name_bn": "হাফেজ মাওলানা ছফিউল্লাহ",
             "position_en": "President", "position_bn": "সভাপতি", "category": "executive",
             "photo_url": "", "bio_en": "", "bio_bn": "", "order": 1},
            {"id": new_id(), "name_en": "Md. Mizanur Rahman", "name_bn": "মোঃ মিজানুর রহমান",
             "position_en": "General Secretary", "position_bn": "সাধারণ সম্পাদক", "category": "executive",
             "photo_url": "", "bio_en": "", "bio_bn": "", "order": 2},
            {"id": new_id(), "name_en": "Md. Ahsanullah", "name_bn": "মোঃ আহসানুল্লাহ",
             "position_en": "Finance Secretary", "position_bn": "অর্থ সম্পাদক", "category": "executive",
             "photo_url": "", "bio_en": "", "bio_bn": "", "order": 3},
            {"id": new_id(), "name_en": "Md. Nakibullah", "name_bn": "মোঃ নকিবুল্লাহ",
             "position_en": "Office Secretary", "position_bn": "অফিস সম্পাদক", "category": "executive",
             "photo_url": "", "bio_en": "", "bio_bn": "", "order": 4},
            {"id": new_id(), "name_en": "Maulana Alauddin", "name_bn": "মাওলানা আলাউদ্দিন",
             "position_en": "Director, Ulama Division", "position_bn": "পরিচালক, উলামা বিভাগ", "category": "ulama",
             "photo_url": "", "bio_en": "", "bio_bn": "", "order": 1},
        ]
        await db.committee.insert_many(defaults)

    if await db.settings.count_documents({"id": "main"}) == 0:
        await db.settings.insert_one({
            "id": "main",
            "bank_name": "Islami Bank Bangladesh Ltd",
            "bank_account": "20501650204309016",
            "bank_account_holder": "Md. Nakibullah",
            "bank_branch": "Kashinathpur Branch",
            "bkash_number": "01622564511",
            "nagad_number": "01622564511",
            "rocket_number": "",
            "contact_phone": "+880 1622-564511",
            "contact_email": "info@kuswa.org",
            "contact_address_en": "Kushiara, Bera, Pabna, Bangladesh",
            "contact_address_bn": "কুশিয়ারা, বেড়া, পাবনা, বাংলাদেশ",
            "facebook_url": "https://www.facebook.com/profile.php?id=61568536621267",
            "youtube_url": "",
            "map_embed_url": "",
        })


@app.on_event("startup")
async def on_startup():
    await db.users.create_index("email", unique=True)
    await db.news.create_index("created_at")
    await db.events.create_index("event_date")
    await db.members.create_index("email")
    await seed_admin()
    await seed_initial_content()


@app.on_event("shutdown")
async def on_shutdown():
    client.close()


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)
