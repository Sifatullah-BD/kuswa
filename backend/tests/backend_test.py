import os
import uuid
import pytest
import requests

BASE = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE:
    # fallback read from frontend .env
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE = line.split("=", 1)[1].strip().rstrip("/")
API = f"{BASE}/api"
ADMIN = {"email": "admin@kuswa.org", "password": "kuswa@2004"}


@pytest.fixture(scope="session")
def token():
    r = requests.post(f"{API}/auth/login", json=ADMIN, timeout=15)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "access_token" in data and data["user"]["role"] == "admin"
    return data["access_token"]


@pytest.fixture(scope="session")
def auth(token):
    return {"Authorization": f"Bearer {token}"}


def test_root():
    r = requests.get(f"{API}/", timeout=10)
    assert r.status_code == 200
    assert "KUSWA" in r.json().get("message", "")


def test_stats():
    r = requests.get(f"{API}/stats", timeout=10)
    assert r.status_code == 200
    d = r.json()
    for k in ("members", "events", "news", "gallery", "years_active"):
        assert k in d
    assert d["years_active"] >= 21


def test_login_invalid():
    r = requests.post(f"{API}/auth/login", json={"email": "x@y.com", "password": "bad"})
    assert r.status_code == 401


def test_me_and_logout(token, auth):
    r = requests.get(f"{API}/auth/me", headers=auth)
    assert r.status_code == 200
    assert r.json()["email"] == ADMIN["email"]
    r2 = requests.get(f"{API}/auth/me")
    assert r2.status_code == 401
    r3 = requests.post(f"{API}/auth/logout")
    assert r3.status_code == 200


def test_news_crud(auth):
    payload = {"title_en": "TEST_News", "title_bn": "টেস্ট", "content_en": "c", "content_bn": "ক", "category": "news"}
    c = requests.post(f"{API}/news", json=payload, headers=auth)
    assert c.status_code == 200, c.text
    nid = c.json()["id"]
    g = requests.get(f"{API}/news")
    assert g.status_code == 200 and any(x["id"] == nid for x in g.json())
    payload["title_en"] = "TEST_News_Updated"
    u = requests.put(f"{API}/news/{nid}", json=payload, headers=auth)
    assert u.status_code == 200 and u.json()["title_en"] == "TEST_News_Updated"
    d = requests.delete(f"{API}/news/{nid}", headers=auth)
    assert d.status_code == 200
    # unauthorized
    assert requests.post(f"{API}/news", json=payload).status_code == 401


def test_events_crud(auth):
    payload = {"title_en": "TEST_Ev", "title_bn": "ই", "description_en": "d", "description_bn": "ড", "event_date": "2026-06-01"}
    c = requests.post(f"{API}/events", json=payload, headers=auth)
    assert c.status_code == 200
    eid = c.json()["id"]
    payload["title_en"] = "TEST_Ev2"
    u = requests.put(f"{API}/events/{eid}", json=payload, headers=auth)
    assert u.status_code == 200 and u.json()["title_en"] == "TEST_Ev2"
    g = requests.get(f"{API}/events")
    assert g.status_code == 200
    assert requests.delete(f"{API}/events/{eid}", headers=auth).status_code == 200


def test_members_flow(auth):
    em = f"test_{uuid.uuid4().hex[:8]}@kuswa.org"
    payload = {"name": "TEST_Member", "father_name": "F", "address": "A", "email": em, "mobile": "01700000000"}
    r = requests.post(f"{API}/members", json=payload)
    assert r.status_code == 200, r.text
    mid = r.json()["id"]
    assert r.json()["status"] == "pending"
    # public should not show pending
    pub = requests.get(f"{API}/members/public").json()
    assert all(x["id"] != mid for x in pub)
    # admin sees all
    adm = requests.get(f"{API}/members/admin", headers=auth)
    assert adm.status_code == 200 and any(x["id"] == mid for x in adm.json())
    # unauthorized
    assert requests.get(f"{API}/members/admin").status_code == 401
    # approve
    s = requests.put(f"{API}/members/{mid}/status", json={"status": "approved"}, headers=auth)
    assert s.status_code == 200 and s.json()["status"] == "approved"
    pub2 = requests.get(f"{API}/members/public").json()
    assert any(x["id"] == mid for x in pub2)
    # invalid status
    bad = requests.put(f"{API}/members/{mid}/status", json={"status": "weird"}, headers=auth)
    assert bad.status_code == 400
    # cleanup
    assert requests.delete(f"{API}/members/{mid}", headers=auth).status_code == 200


def test_committee_crud(auth):
    payload = {"name_en": "TEST_C", "name_bn": "ট", "position_en": "P", "position_bn": "প"}
    c = requests.post(f"{API}/committee", json=payload, headers=auth)
    assert c.status_code == 200
    cid = c.json()["id"]
    g = requests.get(f"{API}/committee")
    assert g.status_code == 200 and len(g.json()) >= 1
    payload["name_en"] = "TEST_C2"
    u = requests.put(f"{API}/committee/{cid}", json=payload, headers=auth)
    assert u.status_code == 200 and u.json()["name_en"] == "TEST_C2"
    assert requests.delete(f"{API}/committee/{cid}", headers=auth).status_code == 200


def test_gallery_crud(auth):
    payload = {"title_en": "TEST_G", "title_bn": "গ", "media_type": "photo", "media_url": "https://example.com/x.jpg"}
    c = requests.post(f"{API}/gallery", json=payload, headers=auth)
    assert c.status_code == 200
    gid = c.json()["id"]
    g = requests.get(f"{API}/gallery")
    assert g.status_code == 200
    assert requests.delete(f"{API}/gallery/{gid}", headers=auth).status_code == 200


def test_contact_flow(auth):
    payload = {"name": "TEST_Visitor", "email": "v@test.com", "message": "hi"}
    r = requests.post(f"{API}/contact", json=payload)
    assert r.status_code == 200
    cid = r.json()["id"]
    lst = requests.get(f"{API}/contact", headers=auth)
    assert lst.status_code == 200 and any(x["id"] == cid for x in lst.json())
    assert requests.get(f"{API}/contact").status_code == 401
    assert requests.delete(f"{API}/contact/{cid}", headers=auth).status_code == 200


def test_seeded_news_and_filter():
    g = requests.get(f"{API}/news")
    assert g.status_code == 200
    items = g.json()
    # Expect at least 2 seeded items
    assert len(items) >= 2, f"expected >=2 news, got {len(items)}"
    # Filter notice category
    n = requests.get(f"{API}/news", params={"category": "notice"}).json()
    assert all(x.get("category") == "notice" for x in n)
    assert len(n) >= 1


def test_seeded_events():
    g = requests.get(f"{API}/events")
    assert g.status_code == 200
    items = g.json()
    assert len(items) >= 2, f"expected >=2 events, got {len(items)}"


def test_seeded_committee_categories():
    g = requests.get(f"{API}/committee")
    assert g.status_code == 200
    members = g.json()
    assert len(members) >= 5, f"expected >=5 committee, got {len(members)}"
    ulama = [m for m in members if m.get("category") == "ulama"]
    assert any("Alauddin" in m.get("name_en", "") for m in ulama), \
        f"Maulana Alauddin (ulama) missing; ulama members={ulama}"


def test_seeded_settings():
    g = requests.get(f"{API}/settings")
    assert g.status_code == 200
    s = g.json()
    assert s.get("bank_account_holder") == "Md. Nakibullah", s
    assert "Kashinathpur" in (s.get("bank_branch") or ""), s
    assert s.get("bank_account") == "20501650204309016"
    assert s.get("bkash_number") == "01622564511"
    assert s.get("nagad_number") == "01622564511"


def test_committee_category_field(auth):
    payload = {"name_en": "TEST_Ulama", "name_bn": "ট", "position_en": "Imam", "position_bn": "ই", "category": "ulama"}
    c = requests.post(f"{API}/committee", json=payload, headers=auth)
    assert c.status_code == 200
    cid = c.json()["id"]
    assert c.json()["category"] == "ulama"
    assert requests.delete(f"{API}/committee/{cid}", headers=auth).status_code == 200


def test_settings(auth):
    g = requests.get(f"{API}/settings")
    assert g.status_code == 200
    cur = g.json()
    assert cur.get("bank_account") == "20501650204309016"
    assert cur.get("bkash_number") == "01622564511"
    # update
    cur["youtube_url"] = "https://youtube.com/test"
    u = requests.put(f"{API}/settings", json=cur, headers=auth)
    assert u.status_code == 200 and u.json()["youtube_url"] == "https://youtube.com/test"
    # unauthorized
    assert requests.put(f"{API}/settings", json=cur).status_code == 401
