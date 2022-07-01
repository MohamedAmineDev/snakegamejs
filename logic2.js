function clearScreen() {
    context.beginPath();
    context.fillStyle = screenColor;
    context.fillRect(0, 0, board.width, board.height);
}
function createSnakePart(xi, yi) {
    return { x: xi, y: yi };
}
function drawSnake() {
    //context.beginPath();
    let i = 0;
    while (i < snake.length) {
        context.beginPath();
        if (i == 0) {
            
            context.fillStyle = snakeHeadColor;
        }
        else {
            context.fillStyle = snakeBodyColor;
        }
        context.fillRect(snake[i].x, snake[i].y, snakeSize / 2, snakeSize / 2);
        //context.fillRect(snake[i].x, snake[i].y, snakeSize / 2, snakeSize / 2);
        i++;
    }
}
function growSnake() {
    let tails = snake[snake.length - 1];
    snake.push(createSnakePart(tails.x - snakeSize, tails.y));
    tails = snake[snake.length - 1];
    snake.push(createSnakePart(tails.x - snakeSize, tails.y));
    sound.play();
}
function goRight() {
    snake[0].x += velocity;
}
function goLeft() {
    snake[0].x -= velocity;
}
function goUp() {
    snake[0].y -= velocity;
}
function goDown() {
    snake[0].y += velocity;
}
function createAHoleSnake(n) {
    let xi = 100;
    const yi = 100;
    let i = 0;
    while (i < n) {
        snake.push(createSnakePart(xi, yi));
        xi -= snakeSize;
        i++;
    }
}
function pauseTheGame() {
    context.beginPath();
    const x = board.width / 4;
    const y = board.height / 2;
    context.font = "50px "+font;
    context.fillStyle = "white";
    context.fillText("Pause", x, y);
    context.font = "10px "+font;
    context.fillStyle = "red";
    context.fillText("Press any key to resume the game", x, y + 50);
}

function moveSnake() {
    let i = snake.length - 2;
    while (i >= 0) {
        snake[i + 1] = { ...snake[i] };
        i--;
    }
    if (key == "ArrowRight") {
        goRight();
    }
    if (key == "ArrowLeft") {
        goLeft();
    }
    if (key == "ArrowDown") {
        goDown();
    }
    if (key == "ArrowUp") {
        goUp();
    }
}
function createFruit() {
    let xi = board.width + snakeSize;
    let yi = board.height + snakeSize;
    while (xi + snakeSize >= board.width || xi - snakeSize < 0) {
        xi = Math.floor(Math.random() * 400);
    }
    while (yi + snakeSize >= board.height || yi - snakeSize < 0) {
        yi = Math.floor(Math.random() * 400);
    }
    return { x: xi, y: yi };
}
function addFruit(fruit) {
    if (fruit != null && fruit != undefined) {
        fruits.push(fruit);
    }
}
function drawFruits() {
    let i = 0;
    while (i < fruits.length) {
        context.beginPath();
        context.fillStyle = fruitColor;
        context.fillRect(fruits[i].x, fruits[i].y, fruiteSize, fruiteSize);
        i++;
    }
}
function addAFruit() {
    fruits.push(createFruit());
}
function createMultipleFruits(n) {
    let i = 0;
    while (i < n) {
        addAFruit();
        i++;
    }
}
function deleteAFruit(i) {
    fruits.splice(i, 1);
    fruits.push(createFruit());
    score++;
}
function drawGameOver() {
    clearScreen();
    context.beginPath();
    const x = board.width / 4;
    const y = board.height / 2;
    context.font = "30px "+font;
    context.fillStyle = "red";
    context.fillText("Game Over", x, y - 20);
    context.strokeStyle = "white";
    context.strokeText("Game Over", x, y - 20);
    /// Showing the score
    context.font = "20px "+font;
    context.fillStyle = "white";
    context.fillText("Your Score : " + score, x + 20, y + 30);
}
function managecollisions() {
    const size = snakeSize - 4;
    if (snake[0].x - size <= 0 || snake[0].x + size >= board.width || snake[0].y - size <= 0 || snake[0].y >= board.height) {
        loop = 0;
        drawGameOver();
        //return;
    }
    else {
        if (snake.length > 1) {
            let i = 1;
            while (i < snake.length) {
                if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
                    loop = 0;
                    drawGameOver();
                    //return;
                    break;
                }
                i++;
            }
        }
    }
}
function manageKeyboardEvents(e) {
    if (e.key == "ArrowRight" && key != "ArrowLeft" || e.key == "ArrowLeft" && key != "ArrowRight" || e.key == "ArrowDown" && key != "ArrowUp" || e.key == "ArrowUp" && key != "ArrowDown" || e.key == "p") {
        key = e.key;
    }
}
function manageSnakeMeal() {
    const head = snake[0];
    let i = 0;
    while (i < fruits.length) {
        const fruit = fruits[i];
        if (head.x == fruit.x && head.y == fruit.y) {
            deleteAFruit(i);
            growSnake();
        }
        else {
            let xres = Math.abs(head.x - fruit.x);
            let yres = Math.abs(head.y - fruit.y);
            //console.log(xres);
            //console.log(yres);
            if (xres < 3 && yres < 3) {
                deleteAFruit(i);
                growSnake();
            }
        }
        i++;
    }
}
function drawScore() {
    context.beginPath();
    context.fillStyle = scoreColor;
    context.font = "10px "+font;
    context.fillText("Score : " + score, board.width - 45, 10);
}
function game() {
    clearScreen();
    drawScore();
    managecollisions();
    manageSnakeMeal();
    if (loop == 0) { }
    else {
        if (key != "p") {
            drawFruits();
            drawSnake();
            moveSnake();
        }
        else {
            pauseTheGame();
            drawSnake();
        }
    }
}
function gameLoop() {
    console.log("Working...");
    game();
    //setInterval(gameLoop, loop);
    animation = requestAnimationFrame(gameLoop);
    if (loop == 0) {
        cancelAnimationFrame(animation);
        animation = undefined;
    }

    //setInterval(gameLoop,10000/120);
}
function startTheGame() {
    if (animation != undefined) { }
    else {
        document.getElementById('startbtn').disabled = true;
        loop = 1000;
        snake.splice(0, snake.length);
        fruits.splice(0, fruits.length);
        createAHoleSnake(1);
        createMultipleFruits(1);
        //addAFruit();
        document.body.addEventListener('keydown', manageKeyboardEvents);
        gameLoop();
    }

}
function mainMenu() {
    clearScreen();
    context.beginPath();
    const x = board.width / 4;
    const y = board.height / 2;
    context.font = "30px "+font;
    context.fillStyle = "red";
    context.fillText("Snake Game", x, y - 20);
    context.strokeStyle = "white";
    context.strokeText("Snake Game", x, y - 20);
    /// Showing the score
    context.font = "20px "+font;
    context.fillStyle = "white";
    context.fillText("Press start to begin", x, y + 30);
}
function stopTheGame() {
    loop = 0;
    cancelAnimationFrame(animation);
    animation = undefined;
    document.getElementById('startbtn').disabled = false;
    mainMenu();
}
