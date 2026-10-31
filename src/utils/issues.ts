export const issueTopics = [
  { id: "anxiety", label: "اضطراب و وسواس", keywords: ["اضطراب", "وسواس", "OCD", "هراس", "استرس"] },
  { id: "mood", label: "افسردگی و خلق", keywords: ["افسردگی", "خلقی", "دوقطبی", "عاطفی"] },
  { id: "couple", label: "زوج و خانواده", keywords: ["زوج", "خانواده", "تعارض", "طلاق", "خیانت", "روابط"] },
  { id: "premarital", label: "پیش از ازدواج", keywords: ["ازدواج"] },
  { id: "child", label: "کودک و نوجوان", keywords: ["کودک", "نوجوان", "فرزندپروری", "ADHD", "ADD"] },
  { id: "assessment", label: "ارزیابی و تست", keywords: ["ارزیابی", "تست", "روانسنجی", "SWAP"] },
  { id: "personality", label: "شخصیت", keywords: ["شخصیت"] },
] as const;

export type IssueId = (typeof issueTopics)[number]["id"];

export function issuesFor(specialties: string[]): IssueId[] {
  const text = specialties.join(" ");
  return issueTopics.filter((topic) => topic.keywords.some((k) => text.includes(k))).map((topic) => topic.id);
}
