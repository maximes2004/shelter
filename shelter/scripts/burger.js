export function initBurger() {
  const burgerCheckbox = document.querySelector("#burger-checkbox");
  const navLinks = document.querySelectorAll(".header__nav-link");
  const burgerMenu = document.querySelector(".header__nav");

  // 1. Закрытие при клике на любую навигационную ссылку
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (burgerCheckbox.checked) {
        burgerCheckbox.checked = false;
      }
    });
  });

  // 2. Закрытие при клике на область вне меню (оверлей)
  document.addEventListener("click", (e) => {
    // Выполняем проверку, только если мобильное меню сейчас открыто
    if (burgerCheckbox.checked) {
      
      // Проверяем, был ли клик внутри самого выезжающего блока навигации
      const isClickInsideMenu = burgerMenu.contains(e.target);
      
      // Проверяем, был ли клик по кнопке бургера, её полоскам или чекбоксу.
      // Для этого проверяем всю обертку '.header__burger-wrapper'
      const isClickOnBurger = e.target.closest(".header__burger-wrapper");

      // Если кликнули НЕ по меню И НЕ по кнопке бургера — значит клик стопроцентно по оверлею
      if (!isClickInsideMenu && !isClickOnBurger) {
        burgerCheckbox.checked = false; // Насильно закрываем
      }
      
      // Если клик пришелся на .header__burger-wrapper, мы этот блок IF просто игнорируем,
      // позволяя тегу <label> нативно переключить чекбокс и закрыть меню!
    }
  });
}