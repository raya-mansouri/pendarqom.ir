const dialog = document.getElementById("lightbox") as HTMLDialogElement | null;
const img = document.getElementById("lightbox-img") as HTMLImageElement | null;
const lightboxCloseBtn = document.getElementById("lightbox-close");
const triggers = document.querySelectorAll<HTMLElement>("[data-lightbox-trigger]");
let lastIndex = 0;

function openAt(index: number) {
  if (!dialog || !img) return;
  const trigger = triggers[index];
  if (!trigger) return;
  img.src = trigger.dataset.lightboxTrigger ?? "";
  img.alt = trigger.querySelector("img")?.alt ?? "";
  lastIndex = index;
  dialog.showModal();
  lightboxCloseBtn?.focus();
}

triggers.forEach((t, i) => t.addEventListener("click", () => openAt(i)));
lightboxCloseBtn?.addEventListener("click", () => dialog?.close());
dialog?.addEventListener("click", (e) => {
  if (e.target === dialog) dialog.close();
});
dialog?.addEventListener("keydown", (e) => {
  if (!dialog || !img) return;
  if (e.key === "ArrowLeft") openAt((lastIndex + 1) % triggers.length);
  if (e.key === "ArrowRight") openAt((lastIndex - 1 + triggers.length) % triggers.length);
});
