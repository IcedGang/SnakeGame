// Import canvas and context
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Import 
const scoreText = document.querySelector('.score');
const score = document.querySelector('.score_value');
const finalScore = document.querySelector('.final_score > span');
const menu = document.querySelector('.menu');
const buttonPlay = document.querySelector('.play_again');

// Set the canvas width and height
const width = canvas.width;
const height = canvas.height;

// Import the audio file
const audio = new Audio('../assets/audio.mp3');
audio.volume = 0.2;

const size = 30;
const initalPosition = { x: 300, y: 270 };

let snake = [initalPosition];

// increment the score by 5
const incrementScore = () => {
    score.textContent = parseInt(score.textContent) + 5;
    finalScore.textContent = score.textContent;
};

// returns a random position between width and height
const random = (min, max) => {
    const number = Math.floor(Math.random() * (max - min) + min);

    // round the number to the nearest multiple of size
    return Math.round(number / size) * size;
};

// food object
const food = {
    // random position between width and height
    x: random(0, width - size),
    y: random(0, height - size),

    // food color
    color: 'red',
};

// direction of the snake and the loop variable
let direction, loopId;

const drawFood = () => {
    const {x, y, color} = food;

    ctx.shadowColor= color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = color;
    
    // draw the food
    ctx.fillRect(x, y, size, size);
    ctx.shadowBlur = 0;
};

const drawSnake = () => {
    ctx.fillStyle = '#ddd';
    snake.forEach((part, index) => {

        // head
        if (index == snake.length - 1) 
            ctx.fillStyle = 'white';

        // body
        ctx.fillRect(part.x, part.y, size, size)
    });
};

const moveSnake = () => {
    if (!direction) return;

    const head = snake[snake.length - 1];
    snake.shift();

    if (direction == 'right')
        snake.push({x: head.x + size, y: head.y});
    
    if (direction == 'left')
        snake.push({x: head.x - size, y: head.y});
    
    if (direction == 'up')
        snake.push({x: head.x, y: head.y - size});
    
    if (direction == 'down')
        snake.push({x: head.x, y: head.y + size});
    
};

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#191919';

    // vertical lines
    for (let i = size; i < canvas.width; i += size) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }

    // horizontal lines
    for (let i = size; i < canvas.height; i += size) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
};

const checkEat = () => {
    const head = snake[snake.length - 1];

    if (head.x == food.x && head.y == food.y) {
        // add a new part to the snake
        snake.push(head);
        incrementScore();
        audio.play();
        
        let x = random(0, width - size);
        let y = random(0, height - size);

        positionFood(x, y);
    }
};

const positionFood = (x, y) => {
    // check if the new position is not on the snake
    while (snake.some(part => part.x == x && part.y == y)) {
        x = random(0, width - size);
        y = random(0, height - size);
    }

    // update the food position
    food.x = x;
    food.y = y;
};

const checkCollision = () => {
    const head = snake[snake.length - 1];
    const neck = snake.length - 2;
    
    // canvas limits
    const canvasWidth = canvas.width - size;
    const canvasHeight = canvas.height - size;

    // wall collision condition
    const wall = head.x < 0 || head.x >= canvasWidth + 1 || head.y < 0 || head.y >= canvasHeight + 1
    
    // self collision condition
    const self = snake.some((part, index) => {
        return index < neck && part.x == head.x && part.y == head.y;
    });
    
    // check if the snake collided with the wall or itself
    if (wall || self) {
        gameOver();
    }
};

const gameOver = () => {
    direction = undefined;
    
    scoreText.style.display = 'none';
    menu.style.display = 'flex';
    canvas.style.filter = 'blur(5px)';
}; 

const gameLoop = () => {
    scoreText.style.display = 'flex';
    clearInterval(loopId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();
    drawFood();
    moveSnake();
    drawSnake();
    checkEat();
    checkCollision();

    loopId = setTimeout(gameLoop, 200);
};

// start the game
gameLoop();

// listen to the keyboard events
document.addEventListener('keydown', (event) => {
    if (event.key == 'd' && direction != 'left')
        direction = 'right';
    
    if (event.key == 'a' && direction != 'right')
        direction = 'left';
    
    if (event.key == 'w' && direction != 'down')
        direction = 'up';
    
    if (event.key == 's' && direction != 'up')
        direction = 'down';
});

// listen to the play again button
buttonPlay.addEventListener('click', () => {
    score.textContent = "00";
    menu.style.display = 'none';
    canvas.style.filter = 'none';
    
    snake = [initalPosition];
    positionFood(random(0, width - size), random(0, height - size));
});