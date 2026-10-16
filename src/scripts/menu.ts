const toggle = document.getElementById("menu-toggle");
const closeBtn = document.getElementById("menu-close");
const menu = document.getElementById("mobile-menu");
const backdrop = document.getElementById("menu-backdrop");

function focusables(): HTMLElement[] {
  if (!menu) return [];
  return Array.from(
    menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
  );
}

function openMenu() {
  if (!menu || !toggle || !backdrop) return;
  menu.inert = false;
  menu.classList.remove("translate-x-full");
  backdrop.classList.remove("hidden");
  toggle.setAttribute("aria-expanded", "true");
  document.documentElement.style.overflow = "hidden";
  focusables()[0]?.focus();
}

function closeMenu() {
  if (!menu || !toggle || !backdrop) return;
  toggle.focus();
  menu.classList.add("translate-x-full");
  backdrop.classList.add("hidden");
  toggle.setAttribute("aria-expanded", "false");
  document.documentElement.style.overflow = "";
  menu.inert = true;
}

toggle?.addEventListener("click", openMenu);
closeBtn?.addEventListener("click", closeMenu);
backdrop?.addEventListener("click", closeMenu);

document.addEventListener("keydown", (e) => {
  if (!menu || menu.classList.contains("translate-x-full")) return;
  if (e.key === "Escape") {
    closeMenu();
    return;
  }
  if (e.key === "Tab") {
    const items = focusables();
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});
