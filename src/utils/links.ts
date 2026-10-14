export function telHref(raw: string): string {
  return `tel:${raw.replace(/[\s-]/g, "")}`;
}

export function whatsappLink(number: string, message?: string): string {
  const digits = number.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function workshopSignupMessage(title: string): string {
  return `سلام، برای ثبت‌نام کارگاه «${title}» راهنمایی می‌خواستم.`;
}
