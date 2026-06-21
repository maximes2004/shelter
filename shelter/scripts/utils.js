/*Перемешивает элементы массива в случайном порядке (Алгоритм Фишера-Йетса)*/
export function shuffle(array) {
  // Создаем копию массива, чтобы не мутировать (не портить) оригинальные данные
  const shuffledArray = [...array]; 
  
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // Меняем элементы местами с помощью деструктуризации
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  
  return shuffledArray;
}