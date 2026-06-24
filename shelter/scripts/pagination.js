import { loadPets } from './api.js';
import { generate48Pets } from './utils.js';

// --- СОСТОЯНИЕ (STATE) ---
let flat48Pets = [];    // Массив из 48 питомцев
let currentPage = 1;    // Текущая страница

// --- DOM ЭЛЕМЕНТЫ ---
const cardsContainer = document.querySelector('.our-pets__cards');
const btnStart = document.querySelector('.pets-arrow--tostart');
const btnPrev = document.querySelector('.pets-arrow--prev');
const btnNext = document.querySelector('.pets-arrow--next');
const btnEnd = document.querySelector('.pets-arrow--toend');
const pageIndicator = document.querySelector('.pets-arrow--page');

// 1. Считаем, сколько карточек должно быть на одной странице
function getCardsPerPage() {
  const width = window.innerWidth;
  if (width >= 1280) return 8;
  if (width >= 768) return 6;
  return 3;
}

// 2. Считаем максимальное количество страниц
function getMaxPages() {
  return 48 / getCardsPerPage();
}

// 3. Шаблонизатор карточки (подстроен под твои классы в Our Pets)
function createCardHtml(pet) {
  return `
    <div class="our-pets__card pet-card" data-name="${pet.name}">
      <img class="pet-card__img" src="${pet.img}" alt="${pet.name}">
      <h2 class="pet-card__name">${pet.name}</h2>
      <button class="btn pet-card__btn">Learn more</button>
    </div>
  `;
}

// 4. Отрисовка карточек для текущей страницы с анимацией появления
function renderPage() {
  const cardsPerPage = getCardsPerPage();
  const maxPages = getMaxPages();

  // Если из-за ресайза текущая страница вылетела за рамки, корректируем
  if (currentPage > maxPages) {
    currentPage = maxPages;
  }

  // Находим нужный кусочек из 48 элементов
  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const pagePets = flat48Pets.slice(startIndex, endIndex);

  // Запускаем плавную анимацию исчезновения/появления (fade)
  cardsContainer.style.opacity = '0';
  
  setTimeout(() => {
    cardsContainer.innerHTML = pagePets.map(pet => createCardHtml(pet)).join('');
    cardsContainer.style.opacity = '1';
  }, 150); // Половина времени от CSS transition

  // Обновляем циферку на индикаторе
  pageIndicator.textContent = currentPage;

  // Обновляем состояние кнопок (активны/неактивны)
  updateButtons();
}

// 5. Управление классами активности кнопок
function updateButtons() {
  const maxPages = getMaxPages();
  const inactiveClass = 'pets-arrow--inactive';

  // Кнопки назад (« и <)
  if (currentPage === 1) {
    btnStart.classList.add(inactiveClass);
    btnPrev.classList.add(inactiveClass);
    btnStart.disabled = true;
    btnPrev.disabled = true;
  } else {
    btnStart.classList.remove(inactiveClass);
    btnPrev.classList.remove(inactiveClass);
    btnStart.disabled = false;
    btnPrev.disabled = false;
  }

  // Кнопки вперед (> и »)
  if (currentPage === maxPages) {
    btnNext.classList.add(inactiveClass);
    btnEnd.classList.add(inactiveClass);
    btnNext.disabled = true;
    btnEnd.disabled = true;
  } else {
    btnNext.classList.remove(inactiveClass);
    btnEnd.classList.remove(inactiveClass);
    btnNext.disabled = false;
    btnEnd.disabled = false;
  }
}

// --- СЛУШАТЕЛИ КЛИКОВ ---
function handlePaginationClick(e) {
  const maxPages = getMaxPages();

  if (e.currentTarget === btnNext && currentPage < maxPages) {
    currentPage++;
  } else if (e.currentTarget === btnPrev && currentPage > 1) {
    currentPage--;
  } else if (e.currentTarget === btnStart) {
    currentPage = 1;
  } else if (e.currentTarget === btnEnd) {
    currentPage = maxPages;
  }

  renderPage();
}

// Оптимизированный ресайз
let resizeTimeout;
function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    renderPage();
  }, 150);
}

// --- ИНИЦИАЛИЗАЦИЯ ---
export async function initPagination() {
  if (!cardsContainer) return; // Защита: запускается только на странице Our Pets

  try {
    const allPets = await loadPets();
    
    // Генерируем стабильный массив из 48 карт при загрузке
    flat48Pets = generate48Pets(allPets);

    // Первая отрисовка
    renderPage();

    // Слушатели событий
    btnStart.addEventListener('click', handlePaginationClick);
    btnPrev.addEventListener('click', handlePaginationClick);
    btnNext.addEventListener('click', handlePaginationClick);
    btnEnd.addEventListener('click', handlePaginationClick);
    window.addEventListener('resize', handleResize);

  } catch (error) {
    console.error('Ошибка пагинации:', error);
  }
}