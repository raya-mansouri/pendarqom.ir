# به‌روزرسانی محتوا

## افزودن کارگاه جدید
1. فایل جدید در `src/content/workshops/` (کپی از یک کارگاه موجود)
2. پر کردن frontmatter: `title, instructor, startDate (ISO), dateDisplay (میلادی به شمسی نوشته شده), time, location, capacity, fee, status`
3. `status` یکی از `open` / `full` / `past`
4. commit و push — یک دقیقه بعد سایت به‌روز است

## به‌روزرسانی اطلاعات تماس یا ساعت کاری
فقط `src/data/site.ts` را ویرایش کنید — در همه صفحات اعمال می‌شود.

## انتشار مقاله
فایل جدید در `src/content/articles/`؛ برای پیش‌نویس `draft: true` بگذارید.

## آرشیو کارگاه گذشته
`status: "past"` و به‌روزرسانی `dateDisplay`/`startDate`.

## جایگزینی تصاویر نمونه
عکس واقعی (JPG/PNG) را جایگزین SVG کنید؛ برای عملکرد بهتر از `<Image>` در astro:assets استفاده کنید.
