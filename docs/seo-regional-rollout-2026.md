# SEO regional rollout — Quyết Thắng (October 2026)

## Goals
- Fix inherited homepage canonical, duplicated title suffixes, course labels, inaccurate time claims and template reviews.
- Publish meaningful information hubs: /khoa-hoc, /khoa-hoc/{hang-b,hang-c1,hang-a1,hang-a,nang-hang}.
- Region directory /hoc-lai-xe and 12 area pages. Legacy area names reflect historical Bình Thuận local search names. After the 2025 provincial reorganization, the former Bình Thuận area is part of Lâm Đồng. Avoid claiming these are current district-level administrative units.
- Actual consultation offices: Phan Thiết (291 Trần Hưng Đạo), La Gi (280 Thống Nhất), Bắc Bình (QL1A, Phan Hiệp). Locations must be reconfirmed by the business before publishing.
- Other district/regional pages: online consultations only, not claimed physical offices or training campuses.
- Leads route into existing `/api/lead`. Online consultation is not an online driving test/license service.

## Indexing approach
- Hub and all five course pages indexable; three verified office pages indexable.
- Other seven historic Bình Thuận regional pages plus Đồng Nai and TP.HCM have `noindex, follow` until reviewed and augmented with genuinely unique local service details, local course logistics and relevant media.
- Do not create one scraped/template page per commune: Google doorway/scaled content abuse policy.
- Sitemap contains only indexable location pages and includes both static and dynamic published blog posts.
- Search Console access is unavailable in the current account: confirm indexing only after setup.

## Acceptance checks
- [ ] Vercel preview build succeeds and all 22 new routes load (one course hub + 5 courses + one area hub + 12 area pages = 19 new pages).
- [ ] Inspect rendered canonical of homepage, /khoa-hoc/hang-b, /hoc-lai-xe/phan-thiet, /tin-tuc/{slug}.
- [ ] Check /sitemap.xml contains published Supabase post slugs; no pages marked noindex.
- [ ] Mobile 360, 390, 768, 1440 sizes, hamburger keyboard and navigation.
- [ ] Lead form validation, privacy link, CRM save / Telegram & Zalo notification; no test lead with fake customer details on production.
- [ ] Confirm office location, address, Map links, prices, legal training details with the school.
- [ ] Test Rich Results, request Google indexing and recheck Search Console after publication.

## Source/accuracy
- 2024 Road Traffic Order & Safety Law vehicle class boundaries (B up to 3,500kg; C1 3,500–7,500kg; C above 7,500kg gross design mass): https://xaydungchinhsach.chinhphu.vn/quy-dinh-doi-tuong-dao-tao-de-nang-hang-giay-phep-lai-xe-119240813152533449.htm
- Google doorway page policy: https://developers.google.com/search/docs/essentials/spam-policies#doorways
- Government resolution on provincial consolidation: https://truongchinhtrithainguyen.gov.vn/vi/gioi-thieu-van-ban-moi/gioi-thieu-van-ban-moi/nghi-quyet-so-202-2025-qh15-ngay-12-6-2025-cua-quoc-hoi-ve-viec-sap-xep-don-vi-hanh-chinh-cap-tinh-231.html

## Follow-up
- Enrich the seven noindex historical-area pages and two remote-area pages with unique independently useful verified facts before enabling index, rather than swapping place names.
- Compare GSC clicks/CTR/positions per course, locality and organic lead conversions every month.
- Review content for regulatory changes, current class dates, training duration, actual facilities and admissions offers.
