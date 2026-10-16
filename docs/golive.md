# راهنمای راه‌اندازی (یک‌بار) — pendarqom.ir

این فایل مراحل انتشار سایت روی GitHub Pages با دامنهٔ اختصاصی است. مراحل ۱ و ۲ را **مالک** در پنل دامنه و GitHub انجام می‌دهد؛ مرحلهٔ ۳ پس از پایانش DNS توسط مجری/مالک تأیید می‌شود.

> پیش‌نیاز: کد در شاخهٔ `main` باشد. workflow خودکار (`.github/workflows/deploy.yml`) فقط با **push به `main`** سایت را ساخته و منتشر می‌کند. تا زمانی که `site` با `main` ادغام (merge) نشود، چیزی مستقر نمی‌شود.

## ۱. تنظیم DNS در پنل دامنه (.ir)

| نوع | هاست | مقدار |
|-----|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |
| CNAME | www | raya-mansouri.github.io |

اگر پنل registrar فقط تغییر NameServer می‌دهد (رایج برای دامنه‌های .ir): DNS را به یک سرویس رایگان مثل Cloudflare منتقل کنید و رکوردها را آنجا بسازید.

## ۲. تنظیمات GitHub Pages

- Settings → Pages → Build and deployment → Source: **GitHub Actions**
- Settings → Pages → Custom domain: `pendarqom.ir` → Save (فایل `public/CNAME` همین مقدار را دارد)
- پس از صدور گواهی (چند دقیقه تا یکی دو ساعت بعد از DNS): تیک **Enforce HTTPS** را بزنید

## ۳. تأیید نهایی (پس از resolve شدن DNS)

```bash
dig +short pendarqom.ir A | sort
# انتظار: چهار IP گروه 185.199.x.153

curl -sIL http://pendarqom.ir | grep -E "HTTP|location"
# انتظار: http -> https redirect

curl -sIL https://www.pendarqom.ir | grep -E "HTTP|location"
# انتظار: www -> apex، سپس 200

curl -sI https://pendarqom.ir | head -5
# انتظار: HTTP/2 200
```

## ۴. چک‌لیست پس از استقرار (spec §11)

- [ ] باز کردن https://pendarqom.ir روی موبایل و دسکتاپ؛ قفل HTTPS سبز
- [ ] تست `tel:` و لینک WhatsApp با گوشی واقعی (شماره ۰۹۹ ۵۲۹ ۱۳۰۰)
- [ ] پیش‌نمایش OG در تلگرام/WhatsApp: ارسال لینک در چت و بررسی نمایش `og-default.png`
- [ ] ثبت sitemap در Google Search Console: `https://pendarqom.ir/sitemap-index.xml`
- [ ] Google Rich Results Test روی URL‌های استقرار‌یافته (Task 18 این را محلی انجام داد؛ حالا آنلاین): `https://search.google.com/test/rich-results`
- [ ] validator.schema.org روی صفحات درمانگر/کارگاه/مقاله/FAQ
- [ ] **تأیید مالک پیش از اطلاع‌رسانی عمومی:** شماره پروانه، آیدی تلگرام/ایتا، عکس‌های واقعی (خروجی اینستاگرام)، و خطوط بحران ۱۴۸۰/۱۲۳

> ⚠️ سایت تا جای‌گذاری محتوای واقعی در حالت «نمونه» است و `npm run build:launch` عمداً شکست می‌خورد (۱۸ فایل). **اطلاع‌رسانی عمومی** منوط به تکمیل `docs/content-todo.md` و سبز شدن `build:launch` است.
