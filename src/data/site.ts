export const site = {
  name: "کلینیک علمی روانشناسی پندار نیم رخ",
  shortName: "کلینیک علمی روانشناسی پندار نیم رخ",
  tagline:
    "نماینده گروه سازمان‌های علمی اجتماعی درمانی پندار در قم — خدمات تخصصی روانشناسی به صورت حضوری، تلفنی و آنلاین",
  url: "https://pendarqom.ir",
  phones: [
    { label: "شماره تماس کلینیک", number: "0991 529 1300" },
  ],
  whatsapp: "989915291300",
  instagram: "https://instagram.com/pendarqom",
  telegram: "https://t.me/pendarqom",
  eitea: "https://eitaa.com/pendarqom",
  bale: "https://ble.ir/pendarqom",
  address: "قم، بلوار امین، کوچه ۱۲، پلاک ۱۶",
  maps: {
    neshan: "https://neshan.org/maps/places/b10b3db4894b17336c34aaaba4510d83#c34.622-50.856-15z-0p",
    balad: "https://balad.ir/p/%D9%85%D8%B1%DA%A9%D8%B2-%D8%B9%D9%84%D9%85%DB%8C-%D8%B1%D9%88%D8%A7%D9%86%D8%B4%D9%86%D8%A7%D8%AE%D8%AA%DB%8C-%D9%BE%D9%86%D8%AF%D8%A7%D8%B1-%D9%86%DB%8C%D9%85-%D8%B1%D8%AE-(%D9%85%D8%B1%DA%A9%D8%B2-%D9%85%D8%B4%D8%A7%D9%88%D8%B1%D9%87)-(%DA%A9%D9%84%DB%8C%D9%86%DB%8C%DA%A9-%D8%B1%D9%88%D8%A7%D9%86%D8%B4%D9%86%D8%A7%D8%B3%DB%8C)-qom_medical-office-4if9VGZe18epxO#15/34.62318/50.85532",
  },
  hours: [
    { days: "شنبه تا پنجشنبه", time: "۱۰:۰۰ تا ۲۲:۰۰" },
    { days: "جمعه", time: "تعطیل" },
  ],
  licenses: [
    { org: "سازمان نظام روانشناسی و مشاوره", number: "شماره ۰۰۰۰۰۰ (نمونه)" },
  ],
  crisisLines: [
    { label: "صدای مشاور", number: "1480" },
    { label: "اورژانس اجتماعی", number: "123" },
  ],
  foundedYear: 1397,
} as const;

export type SiteConfig = typeof site;
