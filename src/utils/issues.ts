export const issueTopics = [
  {
    id: "anxiety",
    label: "اضطراب و وسواس",
    hint: "نگرانی مداوم، حملات اضطراب، فکرهای تکراری و وسواس.",
    keywords: ["اضطراب", "وسواس", "OCD", "هراس", "استرس"],
  },
  {
    id: "mood",
    label: "افسردگی و خلق",
    hint: "غم طولانی، بی‌حوصلگی و نوسان خلق.",
    keywords: ["افسردگی", "خلقی", "دوقطبی", "اختلالات عاطفی"],
  },
  {
    id: "couple",
    label: "زوج و رابطه",
    hint: "تعارض با همسر، فاصله عاطفی، خیانت یا رابطه‌های عاطفی.",
    keywords: ["زوج", "تعارض زوجین", "روابط عاطفی", "مشکلات رابطه‌ای", "خیانت"],
  },
  {
    id: "family",
    label: "خانواده",
    hint: "رابطه با والدین یا فرزند، و فرزندپروری.",
    keywords: ["خانواده", "فرزندپروری"],
  },
  {
    id: "child",
    label: "کودک",
    hint: "کودک زیر ۱۲ سال: رفتار، بازی و مدرسه.",
    keywords: ["کودک"],
  },
  {
    id: "teen",
    label: "نوجوان",
    hint: "نوجوان، بلوغ، رفتار و تحصیل.",
    keywords: ["نوجوان"],
  },
  {
    id: "premarital",
    label: "پیش از ازدواج",
    hint: "انتخاب همسر و آمادگی برای زندگی مشترک.",
    keywords: ["ازدواج"],
  },
  {
    id: "pre-divorce",
    label: "پیش از طلاق",
    hint: "تصمیم‌گیری درباره ادامه یا پایان رابطه در بحران زوجی.",
    keywords: ["زوج", "تعارض زوجین"],
  },
  {
    id: "personality",
    label: "شخصیت",
    hint: "الگوهای تکرارشونده در رابطه و نگاه به خود.",
    keywords: ["شخصیت"],
  },
  {
    id: "assessment",
    label: "ارزیابی و تست",
    hint: "تست هوش یا شخصیت و ارزیابی دقیق پیش از درمان.",
    keywords: ["ارزیابی", "تست", "روانسنجی", "SWAP"],
  },
] as const;

export type IssueId = (typeof issueTopics)[number]["id"];

export function issuesFor(specialties: string[]): IssueId[] {
  const text = specialties.join(" ");
  return issueTopics.filter((topic) => topic.keywords.some((k) => text.includes(k))).map((topic) => topic.id);
}
