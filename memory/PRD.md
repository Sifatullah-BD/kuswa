# KUSWA - কুশিয়ারা কল্যাণ সংসদ Website

## Original Problem
Build a bilingual (Bangla + English) website for KUSWA (Kushiara Welfare Association), a non-political social welfare organization established in 2004 in Kushiara, Bera, Pabna. Pages: Home, About, Activities, Committee, Members, News, Events, Gallery, Donation, Contact + JWT-protected Admin CMS.

## Tech Stack
- Backend: FastAPI + Motor (MongoDB) + bcrypt + PyJWT
- Frontend: React 19 + React Router 7 + Tailwind + sonner + lucide-react
- Auth: JWT (Bearer token in localStorage, no cookies / no withCredentials due to wildcard CORS)

## What's Implemented (v1 — 2026-02-10)
- Bilingual (BN/EN) toggle with font swap (Hind Siliguri / Poppins)
- Brand color theme (#0D4F97 / #56C2F0 / #F28C28 / #F5B14C)
- Home page: glassmorphism notice/event alert + hero + stats + activities + news/events + gallery preview + donate CTA
- About page with President's message (Hafez Maulana Sofiullah) + actual KUSWA image
- Activities, Gallery (album filter), News, Events pages — all populated with real KUSWA event photos
- Committee page with category tabs (executive, advisor, ulama, student, expat, business, youth, sports, culture, agriculture, office)
- Members page: registration form (Name, Father's name, DOB, Address, Profession, Institution, Education, Email, Mobile, Blood Group, NID/Birth Reg, Photo URL) + approved members list
- Donation page: Islami Bank Bangladesh Ltd · Kashinathpur Branch · Holder: Md. Nakibullah · A/C 20501650204309016 · bKash/Nagad 01622564511 · with copy buttons
- Contact page with form + Google Maps embed
- JWT Admin: login + dashboard with 7 tabs — News, Events, Committee (with category dropdown), Gallery (with album/topic field), Members (approve/reject), Messages, Settings
- Backend seeded committee: ছফিউল্লাহ (সভাপতি), মিজানুর রহমান (সাঃ সম্পাদক), আহসানুল্লাহ (অর্থ সম্পাদক), নকিবুল্লাহ (অফিস সম্পাদক), মাওলানা আলাউদ্দিন (পরিচালক, উলামা বিভাগ)

## Admin Credentials
- Email: `admin@kuswa.org`
- Password: `kuswa@2004`

## Backlog / Next
- P1: Add Object Storage for direct image upload (currently URL-based)
- P1: Online donation via Stripe / Razorpay
- P2: Member ID card generator
- P2: SMS notifications for new events/notices
- P2: SEO meta + Open Graph + sitemap
- P2: Online voting system
