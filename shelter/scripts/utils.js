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

// Объявляем и экспортируем функцию, принимающую массив из 8 базовых питомцев
export function generate48Pets(allPets) {
  // Инициализируем пустой массив, в который будем собирать итоговые 48 карточек
  let result = [];

  // Запускаем цикл на 6 итераций, так как нам нужно повторить набор из 8 питомцев 6 раз (6 * 8 = 48)
  for (let i = 0; i < 6; i++) {
    // Создаем копию базового массива и случайно перемешиваем её с помощью функции shuffle
    let currentChunk = shuffle([...allPets]);

    // Проверяем: если это не первая итерация И имя последнего питомца в result совпадает с именем первого питомца в новом куске
    if (
      result.length > 0 &&
      result[result.length - 1].name === currentChunk[0].name
    ) {
      // Генерируем случайный индекс от 1 до 7 (первый элемент с индексом 0 пропускаем, чтобы не менять его самого на себя)
      const swapIndex = Math.floor(Math.random() * 7) + 1;
      // Меняем местами первый элемент (индекс 0) и случайно выбранный элемент (swapIndex) внутри текущего куска через деструктуризацию
      [currentChunk[0], currentChunk[swapIndex]] = [
        currentChunk[swapIndex],
        currentChunk[0],
      ];
    }

    // Объединяем уже накопленный массив result и обработанный текущий кусок currentChunk в один новый массив методом concat
    result = result.concat(currentChunk);
  }

  // Возвращаем полностью сформированный и проверенный массив из 48 объектов питомцев
  return result;
}
