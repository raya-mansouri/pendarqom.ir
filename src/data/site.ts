export const site = {
  name: "کلینیک علمی روانشناسی پندار نیم رخ",
  shortName: "پندار نیم رخ",
  tagline:
    "نماینده گروه سازمان‌های علمی اجتماعی درمانی پندار در قم — خدمات روانشناسی به صورت حضوری، تلفنی و آنلاین",
  url: "https://pendarqom.ir",
  phones: [
    { label: "شماره تماس کلینیک", number: "0991 529 1300" },
  ],
  whatsapp: "989915291300",
  instagram: "https://instagram.com/pendarqom",
  // تلگرام و ایتا: شناسه‌ها تأیید نشده — placeholder
  telegram: "https://t.me/[آیدی تلگرام — به‌زودی]",
  eitea: "https://eitaa.com/[آیدی ایتا — به‌زودی]",
  bale: "https://ble.ir/pendarqom",
  address: "قم، [نشانی دقیق کلینیک — به‌زودی]",
  maps: {
    neshan: "https://neshan.org/maps/@35.7,50.0,15z",
    balad: "https://balad.ir/location?q=قم",
    google: "https://www.google.com/maps/search/?api=1&query=pendarqom",
  },
  hours: [
    { days: "شنبه تا چهارشنبه", time: "۱۶:۰۰ تا ۲۱:۰۰" },
    { days: "پنجشنبه", time: "۹:۰۰ تا ۱۳:۰۰" },
    { days: "جمعه", time: "تعطیل" },
  ],
  licenses: [
    { org: "سازمان نظام روانشناسی و مشاوره", number: "پروانه شماره ۰۰۰۰۰۰ (نمونه)" },
  ],
  crisisLines: [
    { label: "صدای مشاور", number: "1480" },
    { label: "اورژانس اجتماعی", number: "123" },
  ],
  foundedYear: 1404,
} as const;

export type SiteConfig = typeof site;
