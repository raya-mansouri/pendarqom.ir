const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/** Maps Persian digits ۰-۹ to Latin 0-9; leaves everything else untouched. */
function latinDigits(input: string): string {
  return input.replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)));
}

export function telHref(raw: string): string {
  return `tel:${latinDigits(raw).replace(/[\s-]/g, "")}`;
}

export function whatsappLink(number: string, message?: string): string {
  const digits = latinDigits(number).replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function workshopSignupMessage(title: string): string {
  return `سلام، برای ثبت‌نام کارگاه «${title}» راهنمایی می‌خواستم.`;
}

export function workshopWaitlistMessage(title: string): string {
  return `سلام، ظرفیت کارگاه «${title}» تکمیل شده است؛ لطفاً نام من را در لیست انتظار این کارگاه ثبت کنید.`;
}

/** Builds an Instagram DM link (opens chat) from a profile URL. */
export function instagramDmLink(profileUrl: string): string {
  const handle = profileUrl.split("/").filter(Boolean).pop() ?? "";
  return `https://ig.me/m/${handle}`;
}
