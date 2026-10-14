export const site = {
  name: "کلینیک علمی روانشناسی پندار نیم رخ",
  shortName: "پندار نیم رخ",
  tagline: "سلامت روان، با روش علمی و در فضایی آرام",
  url: "https://pendarqom.ir",
  phones: [
    { label: "تماس با کلینیک", number: "025 0000 0000" },
  ],
  whatsapp: "989000000000",
  instagram: "https://instagram.com/pendarnimrokh",
  telegram: "https://t.me/pendarnimrokh",
  eitea: "https://eitaa.com/pendarnimrokh",
  bale: "https://ble.ir/pendarnimrokh",
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
