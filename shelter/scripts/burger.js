export function initBurger() {
  const burgerCheckbox = document.querySelector("#burger-checkbox");
  const navLinks = document.querySelectorAll(".header__nav-link");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      // если юзер нажал на ссылку (в т.ч якорную) бургер-меню, то при клике оно закрывается
      if (burgerCheckbox.checked) {
        burgerCheckbox.checked = false;
      }
    });
  });
}
