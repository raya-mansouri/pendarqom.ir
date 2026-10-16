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

> **وضعیت فعلی (راه‌اندازی‌شده):** DNS دامنه نزد **Cloudflare** است و رکوردها **پروکسی (ابر نارنجی)** شده‌اند؛ یعنی `dig` IPهای Cloudflare (مثل `104.21.x` / `172.67.x`) را برمی‌گرداند نه IP مستقیم GitHub. این درست است و HTTPS در لبهٔ Cloudflare خدمت می‌شود. در این حالت، **در اجبار HTTPS به تنظیمات GitHub متکی نباشید — تیک‌ها را در Cloudflare بزنید** (مرحلهٔ ۲ب).

## ۲. تنظیمات GitHub Pages

- Settings → Pages → Build and deployment → Source: **GitHub Actions**
- Settings → Pages → Custom domain: `pendarqom.ir` → Save (فایل `public/CNAME` همین مقدار را دارد)
- اگر DNS **مستقیم** (بدون پروکسی) به GitHub اشاره می‌کند: پس از صدور گواهی، تیک **Enforce HTTPS** را در همین صفحه بزنید.

## ۲ب. تنظیمات Cloudflare (چون DNS پروکسی است — وضعیت فعلی)

- **SSL/TLS → Overview:** Encrypt mode = **Full (strict)** — اما **فقط پس از آنکه گواهی GitHub Pages صادر شده باشد** (در Settings → Pages باید پیام «Your site is ready to be served over HTTPS» را ببینید). تا پیش از صدور گواهی، حالت strict باعث خطای **526** می‌شود: Cloudflare نمی‌تواند با مبدأ TLS معتبر صحبت کند. در این فاصله حالت **Full** سایت را بالا نگه می‌دارد.
- **SSL/TLS → Edge Certificates → Always Use HTTPS = On.** این کار `http://` را با ۳۰۱ به `https://` منتقل می‌کند. تا زمانی که این خاموش است، `http://pendarqom.ir` بدون ریدرکت کد ۲۰۰ برمی‌گرداند.
- **ترتیب ایمن:** (۱) حالت = Full → (۲) صبر کنید تا گواهی Pages صادر شود → (۳) `curl -sI https://pendarqom.ir` = ۲۰۰ → (۴) حالت = Full (strict) → (۵) دوباره ۲۰۰ را بگیرید → (۶) Always Use HTTPS را روشن کنید. (اگر اول ریدرکت روشن شود و گواهی مبدأ مشکل داشته باشد، امکان حلقهٔ ریدرکت هست.)
- **Network:** Minimum TLS 1.2. ریدیرکت `www → apex` در لایهٔ Pages سالم کار می‌کند.
- **HSTS:** فقط پس از آنکه هر چهار حالت بالا (http→https، apex، www، strict) تأیید شدند؛ HSTS با ریدرکت خراب، مرورگرها را برای `max-age` قفل می‌کند.

### عیب‌یابی سریع

| نشانه | معنا | اقدام |
|-------|------|-------|
| `https://pendarqom.ir` → ۵۲۶ ولی `http://pendarqom.ir` → ۲۰۰ | مبدأ در دسترس است، فقط اعتبارسنجی گواهی مبدأ در حالت strict شکست می‌خورد | موقتاً SSL/TLS را روی **Full** بگذارید؛ در GitHub Pages وضعیت صدور گواهی را بررسی و پس از صدور دوباره **Full (strict)** |
| `http://` بدون ریدرکت ۲۰۰ برمی‌گرداند | Always Use HTTPS خاموش است | مرحلهٔ ۲ب |
| خطای ۵۲۱/۵۲۵ | رکوردهای DNS به مبدأ درست وصل نمی‌شوند | رکوردها و پروکسی را در Cloudflare بررسی کنید |

## ۳. تأیید نهایی (پس از resolve شدن DNS)

```bash
dig +short pendarqom.ir A | sort
# پروکسی Cloudflare: IPهای 104.21.x / 172.67.x (منتظر 185.199.x نباشید)
# DNS مستقیم GitHub: چهار IP گروه 185.199.x.153

curl -sIL http://pendarqom.ir | grep -iE "HTTP|^location"
# انتظار پس از روشن‌کردن Always Use HTTPS: HTTP/1.1 301 + Location: https://...
# اگر فقط HTTP 200 برگشت: Always Use HTTPS هنوز خاموش است (مرحلهٔ ۲ب).

curl -sIL https://www.pendarqom.ir | grep -iE "HTTP|^location"
# انتظار: www -> apex، سپس 200

curl -sI https://pendarqom.ir | head -5
# انتظار: HTTP/2 200
# اگر 526 برگشت: گواهی GitHub Pages هنوز معتبر نیست و حالت روی strict است → جدول «عیب‌یابی سریع» مرحلهٔ ۲ب.
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
