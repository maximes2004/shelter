// Импортируем функцию для загрузки данных о животных из api.js
import { loadPets } from "./api.js";
// Импортируем функцию для перемешивания массива из utils.js
import { shuffle } from "./utils.js";

// --- STATE ---
// Массив всех доступных животных
let allPets = [];
// Текущая группа отображаемых животных
let currentGroup = [];
// Флаг, который показывает, идёт ли в данный момент анимация
let isAnimating = false;

// --- DOM ---
// Получаем элемент контейнера с карточками животных
const track = document.querySelector(".pets__cards-wrapper");
// Получаем левую стрелку для навигации
const btnLeft = document.querySelector(".pets-arrow--left");
// Получаем правую стрелку для навигации
const btnRight = document.querySelector(".pets-arrow--right");

// --- HELPERS ---

// Функция для определения количества видимых карточек в зависимости от ширины экрана
function getCardsCount() {
  // Получаем текущую ширину окна браузера
  const width = window.innerWidth;

  // На больших экранах (1200px и больше) показываем 3 карточки
  if (width >= 1200) return 3;
  // На средних экранах (768px и больше) показываем 2 карточки
  if (width >= 768) return 2;

  // На мобильных экранах (меньше 768px) показываем 1 карточку
  return 1;
}

// Функция для расчёта смещения слайдера (расстояние, на которое нужно сдвинуть карточки)
function getSlideWidth() {
  // Получаем количество видимых карточек
  const count = getCardsCount();
  // Получаем первую карточку из DOM
  const first = track.children[0];

  // Если нет первой карточки, возвращаем 0
  if (!first) return 0;
  // Если есть только одна карточка, возвращаем её ширину
  if (!track.children[1]) {
    return first.offsetWidth;
  }

  // Получаем вторую карточку
  const second = track.children[1];

  // Расчитываем расстояние между началом первой и началом второй карточки
  // Это значение включает ширину карточки + gap между ними
  const cardWithGap = second.offsetLeft - first.offsetLeft;

  // Умножаем расстояние между двумя карточками на количество видимых карточек
  // Это даёт нам полное смещение для одного "шага" слайдера
  return cardWithGap * count;
}

// Функция для генерации следующей группы животных для отображения
function generateNextGroup() {
  // Получаем количество видимых карточек
  const count = getCardsCount();

  // Фильтруем всех животных и оставляем только тех, которые не в текущей группе
  const availablePets = allPets.filter((pet) => !currentGroup.includes(pet));

  // Перемешиваем доступных животных, берём нужное количество и возвращаем
  return shuffle([...availablePets]).slice(0, count);
}

// Функция для создания HTML карточки животного
function createCardHtml(pet) {
  // Возвращаем строку с HTML разметкой карточки
  return `
    <figure class="pets__card pet-card" data-name="${pet.name}">
      <img
        class="pet-card__img"
        src="${pet.img}"
        alt="${pet.name}"
      >

      <figcaption class="pet-card__name">
        ${pet.name}
      </figcaption>

      <button class="btn pet-card__btn">
        Learn more
      </button>
    </figure>
  `;
}

// --- SLIDER LOGIC ---

// Функция для движения слайдера вправо
function moveRight() {
  // Если уже идёт анимация, выходим из функции
  if (isAnimating) return;
  // Устанавливаем флаг, что анимация началась
  isAnimating = true;

  // Генерируем следующую группу животных
  const nextGroup = generateNextGroup();
  // Преобразуем группу в HTML строку карточек
  const nextHtml = nextGroup.map(createCardHtml).join("");
  // Получаем количество видимых карточек
  const count = getCardsCount();

  // Добавляем новые карточки в конец контейнера (справа)
  track.insertAdjacentHTML("beforeend", nextHtml);

  // Форсируем пересчёт layout браузером через обращение к offsetHeight
  track.offsetHeight;

  // Расчитываем смещение ПОСЛЕ добавления элементов (когда браузер пересчитал layout)
  const shift = getSlideWidth();

  // Логируем значения для отладки
  console.log("=== moveRight ===");
  console.log("Shift:", shift);
  console.log(
    "Distance between cards:",
    track.children[1].offsetLeft - track.children[0].offsetLeft,
  );

  // Отключаем transition для мгновенного применения transform
  track.style.transition = "none";
  // Сбрасываем transform в начальную позицию
  track.style.transform = "translate3d(0, 0, 0)";

  // Используем requestAnimationFrame дважды для синхронизации с браузером
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // Включаем transition для плавной анимации
      track.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
      // Смещаем контейнер на calculated shift влево
      track.style.transform = `translate3d(-${shift}px, 0, 0)`;
    });
  });

  // Слушаем событие окончания transition
  track.addEventListener(
    "transitionend",
    function handler() {
      // Отключаем transition после окончания анимации
      track.style.transition = "none";

      // Удаляем старые карточки (которые теперь слева, за границей видимости)
      for (let i = 0; i < count; i++) {
        track.firstElementChild.remove();
      }

      // Сбрасываем transform в начальную позицию
      track.style.transform = "translate3d(0, 0, 0)";

      // Обновляем текущую группу на новую
      currentGroup = nextGroup;
      // Устанавливаем флаг, что анимация закончилась
      isAnimating = false;

      // Удаляем слушатель события (больше не нужен)
      track.removeEventListener("transitionend", handler);
    },
    // { once: true } - слушатель сработает только один раз
    { once: true },
  );
}

// Функция для движения слайдера влево
function moveLeft() {
  // Если уже идёт анимация, выходим из функции
  if (isAnimating) return;
  // Устанавливаем флаг, что анимация началась
  isAnimating = true;

  // Генерируем следующую группу животных
  const nextGroup = generateNextGroup();
  // Преобразуем группу в HTML строку карточек
  const nextHtml = nextGroup.map(createCardHtml).join("");
  // Получаем количество видимых карточек
  const count = getCardsCount();

  // Добавляем новые карточки в начало контейнера (слева)
  track.insertAdjacentHTML("afterbegin", nextHtml);

  // Форсируем пересчёт layout браузером
  track.offsetHeight;

  // Расчитываем смещение ПОСЛЕ добавления элементов
  const shift = getSlideWidth();

  // Логируем значения для отладки
  console.log("=== moveLeft ===");
  console.log("Shift:", shift);

  // Отключаем transition для мгновенного применения transform
  track.style.transition = "none";
  // Смещаем контейнер влево на calculated shift (без анимации)
  track.style.transform = `translate3d(-${shift}px, 0, 0)`;

  // Используем requestAnimationFrame дважды для синхронизации с браузером
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // Включаем transition для плавной анимации
      track.style.transition = "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
      // Сдвигаем контейнер обратно в начальную позицию (плавно)
      track.style.transform = "translate3d(0, 0, 0)";
    });
  });

  // Слушаем событие окончания transition
  track.addEventListener(
    "transitionend",
    function handler() {
      // Отключаем transition после окончания анимации
      track.style.transition = "none";

      // Удаляем старые карточки (которые теперь справа, за границей видимости)
      for (let i = 0; i < count; i++) {
        track.lastElementChild.remove();
      }

      // Сбрасываем transform в начальную позицию
      track.style.transform = "translate3d(0, 0, 0)";

      // Обновляем текущую группу на новую
      currentGroup = nextGroup;
      // Устанавливаем флаг, что анимация закончилась
      isAnimating = false;

      // Удаляем слушатель события
      track.removeEventListener("transitionend", handler);
    },
    // { once: true } - слушатель сработает только один раз
    { once: true },
  );
}

// --- RESIZE ---

// Переменная для хранения ID таймера изменения размера
let resizeTimeout;

// Функция, которая срабатывает при изменении размера окна
function handleResize() {
  // Очищаем предыдущий таймер (если он был)
  clearTimeout(resizeTimeout);

  // Устанавливаем новый таймер на 150ms (для предотвращения множественных срабатываний)
  resizeTimeout = setTimeout(() => {
    // Генерируем новую случайную группу животных с новым количеством
    currentGroup = shuffle([...allPets]).slice(0, getCardsCount());

    // Перерендериваем карточки в контейнере
    track.innerHTML = currentGroup.map((pet) => createCardHtml(pet)).join("");

    // Отключаем transition
    track.style.transition = "none";
    // Сбрасываем transform в начальную позицию
    track.style.transform = "translate3d(0, 0, 0)";
  }, 150);
}

// --- INIT ---

// Асинхронная функция для инициализации слайдера
export async function initCarousel() {
  // Если элемент track не найден в DOM, выходим
  if (!track) return;

  // Обрабатываем ошибки при загрузке
  try {
    // Загружаем все данные о животных с сервера
    allPets = await loadPets();

    // Генерируем стартовую группу животных (перемешанные и нужное количество)
    currentGroup = shuffle([...allPets]).slice(0, getCardsCount());

    // Рендериваем начальные карточки в контейнер
    track.innerHTML = currentGroup.map((pet) => createCardHtml(pet)).join("");

    // Добавляем слушатель клика на правую стрелку
    btnRight.addEventListener("click", moveRight);
    // Добавляем слушатель клика на левую стрелку
    btnLeft.addEventListener("click", moveLeft);

    // Добавляем слушатель события изменения размера окна
    window.addEventListener("resize", handleResize);

    // Логируем успешную инициализацию
    console.log("Carousel initialized");
    console.log("Initial cards count:", getCardsCount());
    console.log("Initial slide width:", getSlideWidth());
  } catch (error) {
    // Если произошла ошибка, логируем её в консоль
    console.error("Ошибка при запуске слайдера:", error);
  }
}
