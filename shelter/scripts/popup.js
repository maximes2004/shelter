// Импортируем функцию загрузки данных из модуля api.js
import { loadPets } from './api.js';
// Импортируем функцию перемешивания массива из утилит (если понадобится в будущем)
import { shuffle } from './utils.js';

// Локальная база данных: здесь мы будем хранить массив из 8 объектов питомцев
let allPetsData = [];

// --- DOM ЭЛЕМЕНТЫ ПОП-АПА ---
// Находим элемент затемненного фона-задника по его уникальному ID
const backdrop = document.getElementById('popup-backdrop');
// Находим кнопку-крестик для закрытия модального окна по её ID
const closeBtn = document.getElementById('popup-close-btn');
// Находим внутренний контейнер, куда будем динамически вставлять данные питомца
const contentContainer = document.getElementById('popup-content');

// 1. Функция-шаблонизатор для генерации HTML-структуры карточки внутри поп-апа
function createPopupContentHtml(pet) {
  // Возвращаем строку с HTML-разметкой, интерполируя данные конкретного питомца
  return `
    <img class="popup__img" src="${pet.img}" alt="${pet.name}">
    <div class="popup__text-block">
      <h3 class="popup__title">${pet.name}</h3>
      <h4 class="popup__subtitle">${pet.type} - ${pet.breed}</h4>
      <p class="popup__description">${pet.description}</p>
      <ul class="popup__list">
        <li><strong>Age:</strong> ${pet.age}</li>
        <li><strong>Inoculations:</strong> ${pet.inoculations.join(', ')}</li>
        <li><strong>Diseases:</strong> ${pet.diseases.join(', ')}</li>
        <li><strong>Parasites:</strong> ${pet.parasites.join(', ')}</li>
      </ul>
    </div>
  `;
}

// 2. Функция открытия поп-апа, принимающая имя питомца для поиска
function openPopup(petName) {
  // Ищем нужный объект питомца в массиве allPetsData по совпадению свойства name
  const pet = allPetsData.find(p => p.name === petName);
  // Если питомец по какой-то причине не найден, прерываем выполнение функции
  if (!pet) return;

  // Генерируем HTML через шаблонизатор и вставляем его внутрь контент-контейнера
  contentContainer.innerHTML = createPopupContentHtml(pet);
  
  // Добавляем БЭМ-модификатор к фону, чтобы поп-ап плавно появился на экране (opacity: 1)
  backdrop.classList.add('popup--active');
  // Добавляем класс на body, чтобы заблокировать прокрутку основной страницы (overflow: hidden)
  document.body.classList.add('popup-open');
}

// 3. Функция закрытия поп-апа
function closePopup() {
  // Удаляем БЭМ-модификатор с фона, запуская CSS-анимацию скрытия (opacity: 0)
  backdrop.classList.remove('popup--active');
  // Удаляем класс с body, возвращая пользователю возможность скроллить страницу
  document.body.classList.remove('popup-open');
  // Очищаем внутренний HTML контейнера, чтобы освободить память браузера
  contentContainer.innerHTML = '';
}

// --- ИНИЦИАЛИЗАЦИЯ И СЛУШАТЕЛИ ---
// Экспортируем главную асинхронную функцию инициализации модуля
export async function initPopup() {
  try {
    // Ждем выполнения запроса и записываем полученный массив питомцев в allPetsData
    allPetsData = await loadPets();
  } catch (e) {
    // Если запрос завершился ошибкой, выводим её в консоль для отладки
    console.error('Не удалось загрузить данные для поп-апа', e);
    // Прерываем инициализацию, так как без данных поп-ап работать не сможет
    return;
  }

  // МЕТОД ДЕЛЕГИРОВАНИЯ СОБЫТИЙ: Вешаем один слушатель клика на весь документ
  document.addEventListener('click', (e) => {
    // Проверяем, был ли клик совершен по карточке .pet-card или внутри неё
    const card = e.target.closest('.pet-card');
    
    // Если клик действительно произошел на карточке питомца
    if (card) {
      // Считываем имя питомца из кастомного HTML-атрибута data-name
      const petName = card.getAttribute('data-name');
      // Передаем имя в функцию открытия поп-апа
      openPopup(petName);
    }
  });

  // Навешиваем событие клика на кнопку-крестик для вызова функции закрытия
  closeBtn.addEventListener('click', closePopup);

  // Навешиваем событие клика на сам затемненный фон
  backdrop.addEventListener('click', (e) => {
    // Проверяем, что кликнули именно по фону (backdrop), а не по белому окну внутри него
    if (e.target === backdrop) {
      // Если клик пришелся мимо окна — закрываем поп-ап
      closePopup();
    }
  });
}