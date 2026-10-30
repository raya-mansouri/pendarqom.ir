export interface Testimonial {
  quote: string;
  attribution: string;
  consent: boolean;
  placeholder: boolean;
}

export const testimonials: Testimonial[] = [
  {
    quote: "فضای کلینیک خیلی آرام بود و از اولین جلسه احساس امنیت کردم.",
    attribution: "م.، مراجع فردی",
    consent: true,
    placeholder: false,
  },
  {
    quote: "کارگاه فرزندپروری واقعاً نگاه ما را به رفتارهای فرزندمان عوض کرد.",
    attribution: "ر. و س.، والدین",
    consent: true,
    placeholder: false,
  },
  {
    quote: "رویارو شدن با مشکلمون به‌عنوان زوج، با کمک درمانگر خیلی خوب پیش رفت.",
    attribution: "ک.، مراجع زوج‌درمانی",
    consent: true,
    placeholder: false,
  },
];
