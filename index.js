

document.addEventListener('DOMContentLoaded', () => {
  const gameContainer = document.getElementById('game-container');
  const restartBtn = document.getElementById('restart-btn');
  const scoreDisplay = document.getElementById('score');
  const gridSize = 20;
  const cellSize = 20;
  let snake = [{ x: 10, y: 10 }];
  let food = { x: 15, y: 10 };
  let direction = 'right';
  let intervalId;
  let score = 0;
  

  function createGrid() {
    gameContainer.innerHTML = '';
  
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.style.width = cellSize + 'px';
        cell.style.height = cellSize + 'px';
        gameContainer.appendChild(cell);
      }
    }
  }
  
  function renderSnake() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.classList.remove('snake', 'snake-head')); 
    snake.forEach((segment, index) => {
      const cellIndex = segment.y * gridSize + segment.x;
      cells[cellIndex].classList.add('snake');
      if (index === 0) {
        cells[cellIndex].classList.add('snake-head'); 
      }
    });
  }

  function renderFood() {
    const cellIndex = food.y * gridSize + food.x;
    const cell = document.querySelectorAll('.cell')[cellIndex];
    cell.classList.add('food');
  }

  function generateFood() {
    let x = Math.floor(Math.random() * gridSize);
    let y = Math.floor(Math.random() * gridSize);
    while (snake.some(segment => segment.x === x && segment.y === y)) {
      x = Math.floor(Math.random() * gridSize);
      y = Math.floor(Math.random() * gridSize);
    }
    const previousFoodCellIndex = food.y * gridSize + food.x;
    const previousFoodCell = document.querySelectorAll('.cell')[previousFoodCellIndex];
    previousFoodCell.classList.remove('food');
    food = { x, y };
    renderFood();
  }

  function moveSnake() {
    const head = { ...snake[0] };
    switch (direction) {
      case 'up':
        head.y--;
        break;
      case 'down':
        head.y++;
        break;
      case 'left':
        head.x--;
        break;
      case 'right':
        head.x++;
        break;
    }

    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
      gameOver();
      return;
    }

    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      gameOver();
      return;
    }

    snake.unshift(head);

    const cellIndex = head.y * gridSize + head.x;
    const cell = document.querySelectorAll('.cell')[cellIndex];
    if (cell.classList.contains('food')) {
        score++;
        clearInterval(intervalId); 
    intervalId = setInterval(moveSnake, 200 - (score*2));
        cell.classList.remove('food'); 
        generateFoodRandomly();
    } else {
        snake.pop();
    }

    renderSnake();
    updateScoreDisplay();
  }

  function startGame() {
    createGrid();
    snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 }, 
      { x: 8, y: 10 },  
      { x: 7, y: 10 }, 
      { x: 6, y: 10 }   
    ];
    generateFood();
    
    intervalId = setInterval(moveSnake, 200);
    updateScoreDisplay();
    foodIntervalId=setInterval(generateFoodRandomly, 6000);

  }
  
  function gameOver() {
    clearInterval(intervalId);
    clearInterval(foodIntervalId); 
    const topScores = JSON.parse(localStorage.getItem('topScores')) || [];
    if (topScores.length < 5 || score > topScores[4].score) {
      const nickname = prompt('Congratulations! You made it to the top 5! Enter your nickname:');
      const newScore = { score, nickname };
      topScores.push(newScore);
      topScores.sort((a, b) => b.score - a.score);
      topScores.splice(5);
      localStorage.setItem('topScores', JSON.stringify(topScores));
      displayTopScores(); 
    } else {
      alert('Game Over!');
    }

  }


  function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
    
  }

  function displayTopScores() {
    const topScores = JSON.parse(localStorage.getItem('topScores')) || [];
    const scoreTableBody = document.getElementById('score-table-body');
    scoreTableBody.innerHTML = '';
    topScores.forEach((entry, index) => {
      const row = document.createElement('tr');
      const nicknameCell = document.createElement('td');
      if (index === 0) {
        nicknameCell.textContent = `${entry.nickname || 'Anonymous'} 🏆`;
      } else {
        nicknameCell.textContent = entry.nickname || 'Anonymous';
      }
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${entry.score}</td>
      `;
      row.appendChild(nicknameCell);
      scoreTableBody.appendChild(row);
    });
  }
  
  displayTopScores();
  
  restartBtn.addEventListener('click', () => {
    clearInterval(intervalId); 
    snake = [{ x: 10, y: 10 }];
    direction = 'right';
    gameContainer.querySelectorAll('.cell').forEach(cell => cell.classList.remove('snake', 'food'));
    score = 0;
    startGame();
  });

  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'w' || key === 'arrowup') {
      if (direction !== 'down') {
        direction = 'up';
      }
    } else if (key === 's' || key === 'arrowdown') {
      if (direction !== 'up') {
        direction = 'down';
      }
    } else if (key === 'a' || key === 'arrowleft') {
      if (direction !== 'right') {
        direction = 'left';
      }
    } else if (key === 'd' || key === 'arrowright') {
      if (direction !== 'left') {
        direction = 'right';
      }
    }
  });
  function generateFoodRandomly() {
    let x, y;
    do {
        x = Math.floor(Math.random() * gridSize);
        y = Math.floor(Math.random() * gridSize);
    } while (snake.some(segment => segment.x === x && segment.y === y));

    food = { x, y };
    const cellIndex = y * gridSize + x;
    const cell = document.querySelectorAll('.cell')[cellIndex];
    cell.classList.add('food');
}
});



