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

// Функция shuffle уже есть, оставляем её без изменений...

export function generate48Pets(allPets) {
  let result = [];
  
  for (let i = 0; i < 6; i++) {
    let currentChunk = shuffle([...allPets]);
    
    // Если это не первый кусочек и на стыке образуется дубль
    if (result.length > 0 && result[result.length - 1].name === currentChunk[0].name) {
      // Меняем первый элемент текущего куска с его же случайным другим элементом
      const swapIndex = Math.floor(Math.random() * 7) + 1; // от 1 до 7
      [currentChunk[0], currentChunk[swapIndex]] = [currentChunk[swapIndex], currentChunk[0]];
    }
    
    result = result.concat(currentChunk);
  }
  
  return result;
}