import { loadPets } from "./api.js";
import { shuffle } from "./utils.js";

// --- НАСТРОЙКИ И СОСТОЯНИЕ (STATE) СЛАЙДЕРА ---
let allPets = []; // База данных: все 8 питомцев из JSON
let currentGroup = []; // Что отображается на экране прямо сейчас (массив объектов)
let isAnimating = false; // Флаг-предохранитель от спам-кликов (Пункт 6 ТЗ)

// --- DOM ЭЛЕМЕНТЫ ---
const track = document.querySelector(".pets__cards-wrapper");
const btnLeft = document.querySelector(".pets-arrow--left");
const btnRight = document.querySelector(".pets-arrow--right");

// --- ВСПОМОГАТЕЛЬНЫЕ УТИЛИТЫ ДЛЯ СЛАЙДЕРА ---

// 1. Определяем, сколько карточек должно быть на экране (Пункт 1 ТЗ)
function getCardsCount() {
  const width = window.innerWidth;
  if (width >= 1280) return 3;
  if (width >= 768) return 2;
  return 1;
}

// 2. Генерируем следующую уникальную группу питомцев (Пункт 3 и 4 ТЗ)
function generateNextGroup() {
  const count = getCardsCount();
  // Исключаем тех, кто уже на экране
  const availablePets = allPets.filter((pet) => !currentGroup.includes(pet));
  // Перемешиваем оставшихся и забираем нужный кусочек
  return shuffle([...availablePets]).slice(0, count);
}

// 3. HTML-шаблон для карточки
function createCardHtml(pet) {
  return `
    <div class="pet-card" data-name="${pet.name}">
      <img class="pet-card__img" src="${pet.img}" alt="${pet.name}">
      <h4 class="pet-card__title">${pet.name}</h4>
      <button class="btn-secondary">Learn more</button>
    </div>
  `;
}

// --- ЛОГИКА АНИМАЦИИ И ДВИЖЕНИЯ (Пункт 5 и 6 ТЗ) ---

function moveRight() {
  if (isAnimating) return; // Игнорируем клик, если анимация еще идет
  isAnimating = true;

  const nextGroup = generateNextGroup();
  const nextHtml = nextGroup.map((pet) => createCardHtml(pet)).join("");

  track.insertAdjacentHTML("beforeend", nextHtml);
  track.classList.add("transition-left");

  track.addEventListener("transitionend", function animationEndHandler() {
    track.classList.remove("transition-left");

    const count = getCardsCount();
    for (let i = 0; i < count; i++) {
      track.firstElementChild.remove();
    }

    currentGroup = nextGroup;
    isAnimating = false;
    track.removeEventListener("transitionend", animationEndHandler);
  });
}

function moveLeft() {
  if (isAnimating) return;
  isAnimating = true;

  const nextGroup = generateNextGroup();
  const nextHtml = nextGroup.map((pet) => createCardHtml(pet)).join("");

  track.insertAdjacentHTML("afterbegin", nextHtml);

  track.style.transition = "none";
  track.classList.add("transition-right-start");
  track.offsetHeight; // Reflow для применения стилей до анимации

  track.style.transition = "";
  track.classList.remove("transition-right-start");

  track.addEventListener("transitionend", function animationEndHandler() {
    const count = getCardsCount();
    for (let i = 0; i < count; i++) {
      track.lastElementChild.remove();
    }

    currentGroup = nextGroup;
    isAnimating = false;
    track.removeEventListener("transitionend", animationEndHandler);
  });
}

// Умный ресайз: перестраивает слайдер, если пользователь повернул телефон/изменил окно
let resizeTimeout;
function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Пересчитываем карточки под новый размер экрана
    currentGroup = shuffle([...allPets]).slice(0, getCardsCount());
    track.innerHTML = currentGroup.map((pet) => createCardHtml(pet)).join("");
  }, 150);
}

// --- ГЛАВНАЯ ТОЧКА ИНИЦИАЛИЗАЦИИ ---
export async function initCarousel() {
  // Защита: если на текущей странице (например, Pets) нет ленты слайдера, скрипт тихо завершит работу
  if (!track) return;

  try {
    // Шаг 1: Загружаем все данные
    allPets = await loadPets();

    // Шаг 2: Создаем случайную стартовую группу и рендерим её в HTML
    currentGroup = shuffle([...allPets]).slice(0, getCardsCount());
    track.innerHTML = currentGroup.map((pet) => createCardHtml(pet)).join("");

    // Шаг 3: Вешаем слушатели событий на управление
    btnRight.addEventListener("click", moveRight);
    btnLeft.addEventListener("click", moveLeft);
    window.addEventListener("resize", handleResize);
  } catch (error) {
    console.error("Ошибка при запуске слайдера:", error);
  }
}
