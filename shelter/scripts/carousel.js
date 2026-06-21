
// Импортируем обе функции
import { loadPets } from './api.js';
import { shuffle } from './utils.js';

let allPets = []; // Переменная, где будут лежать данные

export async function initCarousel() {
  // ШАГ 1: Вызываем загрузчик. 
  // Функция res.json() внутри api.js превратила строку Json в массив JavaScript.
  // Мы сохраняем этот готовый массив в переменную allPets.
  allPets = await loadPets(); 
  
  // В этот момент в allPets лежит: [{name: "Katrine", ...}, {name: "Jennifer", ...}, ...]

  // ШАГ 2: Передаем данные в утилиту перемешивания.
  // Мы берем переменную allPets, делаем её копию [...allPets] и передаем 
  // ПРЯМО ВНУТРЬ круглых скобок функции shuffle().
  const randomPets = shuffle([...allPets]);
  
  // Теперь в randomPets лежит новый, перемешанный массив.
}