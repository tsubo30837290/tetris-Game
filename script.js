const gameContainer = document.getElementById('game');

const ROWS = 20;
const COLUMNS = 10;

const SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1]
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1]
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0]
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1]
  ],
  L: [
    [1, 0],
    [1, 0],
    [1, 1]
  ],
  J: [
    [0, 1],
    [0, 1],
    [1, 1]
  ]
};

const rotateShape = (shape) => {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated = [];
  for (let col = 0; col < cols; col++) {
    const newRow = [];
    for (let row = rows - 1; row >= 0; row--) {
      newRow.push(shape[row][col]);
    }
    rotated.push(newRow);
  }
  return rotated;
};

let board = [];
for (let row = 0; row < ROWS; row++) {
  const rowArray = [];
  for (let col = 0; col < COLUMNS; col++) {
    rowArray.push(0);
  }
  board.push(rowArray);
}

const renderBoard = () => {
  gameContainer.innerHTML = '';
  board.forEach(row => {
    row.forEach(cell => {
      const div = document.createElement('div');
      div.classList.add('cell');
      if (cell === 1) div.classList.add('active');
      if (cell === 2) div.classList.add('landed');
      gameContainer.appendChild(div);
    });
  });
};

const drawShape = (shape, position) => {
  shape.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell && board[position.row + rowIndex] && board[position.row + rowIndex][position.col + colIndex] !== undefined) {
        board[position.row + rowIndex][position.col + colIndex] = 1;
      }
    });
  });
};

const clearShape = (shape, position) => {
  shape.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell && board[position.row + rowIndex] && board[position.row + rowIndex][position.col + colIndex] !== undefined) {
        board[position.row + rowIndex][position.col + colIndex] = 0;
      }
    });
  });
};

const placeShape = (shape, position) => {
  shape.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell && board[position.row + rowIndex] && board[position.row + rowIndex][position.col + colIndex] !== undefined) {
        board[position.row + rowIndex][position.col + colIndex] = 2;
      }
    });
  });
};

const canMove = (shape, position) => {
  return shape.every((row, rowIndex) => {
    return row.every((cell, colIndex) => {
      if (cell === 0) return true;
      const newRow = position.row + rowIndex;
      const newCol = position.col + colIndex;
      return (
        newRow >= 0 &&
        newRow < ROWS &&
        newCol >= 0 &&
        newCol < COLUMNS &&
        board[newRow][newCol] !== 2
      );
    });
  });
};

// 横一列が揃っているかチェックし、削除する関数
const clearFullRows = () => {
  board = board.filter(row => row.some(cell => cell !== 2));
  const clearedRows = ROWS - board.length;

  // 消えた分だけ新しい空行を追加
  for (let i = 0; i < clearedRows; i++) {
    const newRow = Array(COLUMNS).fill(0);
    board.unshift(newRow);
  }
};

let currentShape = SHAPES.T;
let currentPosition = { row: 0, col: 4 };

const gameLoop = () => {
  clearShape(currentShape, currentPosition);
  const newPosition = { row: currentPosition.row + 1, col: currentPosition.col };
  if (canMove(currentShape, newPosition)) {
    currentPosition = newPosition;
  } else {
    placeShape(currentShape, currentPosition);
    clearFullRows(); // 行の削除をここで呼び出す
    currentShape = Object.values(SHAPES)[Math.floor(Math.random() * Object.values(SHAPES).length)];
    currentPosition = { row: 0, col: 4 };
  }
  drawShape(currentShape, currentPosition);
  renderBoard();
};

setInterval(gameLoop, 500);

document.addEventListener('keydown', (event) => {
  clearShape(currentShape, currentPosition);

  let newPosition = { ...currentPosition };

  if (event.key === 'ArrowLeft') newPosition.col--;
  if (event.key === 'ArrowRight') newPosition.col++;
  if (event.key === 'ArrowDown') newPosition.row++;
  if (event.key === 'ArrowUp') {
    const rotatedShape = rotateShape(currentShape);
    if (canMove(rotatedShape, currentPosition)) {
      currentShape = rotatedShape;
    }
  }

  if (canMove(currentShape, newPosition)) {
    currentPosition = newPosition;
  }

  drawShape(currentShape, currentPosition);
  renderBoard();
});

renderBoard();
