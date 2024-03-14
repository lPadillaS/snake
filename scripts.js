
// declare constants, buttons and adjust gameboard
const startButton = document.getElementById("startButton");
startButton.addEventListener("click", startGameButtn);
const up = document.getElementById("upButton").addEventListener("click",() =>{
    if (ySpeed != 1 && moved)
    {
        ySpeed = -1;
        xSpeed = 0;
        moved = false; 
    }
});
const down = document.getElementById("downButton").addEventListener("click",() =>{
    if (ySpeed != -1 && moved)
    {
        ySpeed = 1;
        xSpeed = 0;
        moved = false; 
    }
});
const left = document.getElementById("leftButton").addEventListener("click",() =>{
    if (xSpeed != 1 && moved)
    {
        ySpeed = 0;
        xSpeed = -1;
        moved = false; 
    }
});
const right = document.getElementById("rightButton").addEventListener("click",() =>{
    if (xSpeed != -1 && moved)
    {
        ySpeed = 0;
        xSpeed = 1;
        moved = false; 
    }
});
let rows = 20;
let cols = 20;
 let cellSize = null;
if (window.screen.width < window.screen.height)
{
    let gridHeight = window.screen.height * .5;
    let gridWidth = window.screen.width * .6;
    cellSize = Math.floor(gridHeight / rows);
    cols = Math.floor(gridWidth / cellSize);
}  
else{
    let gridHeight = window.screen.height * .7;
    let gridWidth = window.screen.width * .4;
    cellSize = Math.floor(gridWidth / cols);
    rows = Math.floor(gridHeight / cellSize);
}
console.log(cellSize)
console.log(cols)
let activeTimer = null;
const grid = document.getElementById("gameBoard");
grid.style.width = cols * cellSize + "px";
grid.style.height = rows * cellSize + "px";
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("high-score");

// declare variables
let xSpeed = 1;
let ySpeed = 0;
let appleCoords = null;
let snakeBody = [];
let newHead = {x: 0, y: 0};
let score = 0;
let highScore = 0;
let moved = false;
snakeBody.unshift(newHead);
// Create the grid
let gridArray = [];
for(let yA = 0; yA < rows ; yA++)
{
    gridArray[yA] = [];
    for(let xA = 0; xA < cols; xA++)
    {
        let square = document.createElement("div");
        square.style.width = cellSize + "px";
        square.style.height = cellSize + "px";
        square.style.boxSizing = "border-box";  
        square.className = "null";
        square.id = yA.toString() + "-" + xA.toString()  
        grid.append(square);
        gridArray[yA][xA] = square;
    }
}
document.addEventListener("keydown", handleStart); // listen for input, if input = enter, start the game


function createFood(){ //self explanatory...
    let nulls = document.getElementsByClassName("null");
    let applePos = Math.floor(Math.random() * (nulls.length));
    let id = nulls[applePos].id.split("-");
    let appleY = id[0];
    let appleX = id[1];
    let apple = {x: appleX, y: appleY};
    nulls[applePos].className = "apple"

    return apple;
}
function handleStart(event){
    if (event.key == "Enter")
    {
        document.removeEventListener("keydown", handleStart);
        startGame();
    }
}
function startGameButtn(){
    startButton.style.display = "none";
    startButton.removeEventListener("click", startGameButtn);
    startGame();
}

function startGame(){
    gridArray[newHead.y][newHead.x].className = "snake";
    appleCoords = createFood();
    document.addEventListener("keydown", changeDirection)
    update(moveSnake);
}

function changeDirection(event){  //change y and x speed accordingly
    switch(event.key)
    {
        case "ArrowUp":
            if (ySpeed != 1 && moved)
            {
                ySpeed = -1;
                xSpeed = 0;
                moved = false; 
            }
            break;
        case "ArrowDown":          
            if (ySpeed != -1 && moved)
            {
                ySpeed = 1;
                xSpeed = 0;   
                moved = false; 
            }
            break;                
        case "ArrowRight":
            if (xSpeed != -1 && moved)
            {
                ySpeed = 0;
                xSpeed = 1;   
                moved = false; 
            }
            break;
        case "ArrowLeft":
            if (xSpeed != 1 && moved)
            {
                ySpeed = 0;
                xSpeed = -1; 
                moved = false; 
            }
            break;
    }
}
function moveSnake(){
    let head = {x: newHead.x, y: newHead.y};
    newHead = {x: head.x + xSpeed, y: head.y + ySpeed};
    moved = true;
    let isColliding = checkCollision();
    if(!isColliding)
    {
        gridArray[newHead.y][newHead.x].className = "snake";
    
        snakeBody.unshift(newHead)
        let tail = snakeBody[snakeBody.length - 1];
        if (newHead.x == appleCoords.x && newHead.y == appleCoords.y)
        {
            if (score >= highScore)
            {
                highScore++
                highScoreDisplay.innerText = "Highscore: " + highScore;
            }
            score++;
            if(score == ((rows * cols) - 1))
            {
                alert("YOU WIN!")
                resetGame();
            }
            scoreDisplay.innerText = "Score: " + score;
            appleCoords = createFood();
            console.log(snakeBody);
        }
        else{
            snakeBody.pop();
            gridArray[tail.y][tail.x].className = "null"
        }
    
    }
    else
    {
        resetGame();
    }

}
function resetGame(){
    moved = false;  
    ySpeed = 0;
    xSpeed = 1;
    clearInterval(activeTimer);
    score = 0;
    scoreDisplay.innerText = "Score: " + score;      //reset variables
    snakeBody = [];
    newHead = {x: 0, y: 0};
    snakeBody.unshift(newHead);
    console.log(snakeBody);
    for (let i = 0; i < rows; i++)
    {
        for (let j = 0; j < cols; j++)
        {
            gridArray[i][j].className = "null";       //clear the grid
        }
    }
    document.removeEventListener("keydown", changeDirection);       //add back the event listener to start playing
    document.addEventListener("keydown", handleStart);
    if (window.screen.width < window.screen.height)
    {
        startButton.addEventListener("click", startGameButtn)
        startButton.style.display = "inline";
    }


}
function checkCollision(){
    
    let collision = false;
    for (let i = 0; i < snakeBody.length; i++)
    {
        if (newHead.x == snakeBody[i].x && newHead.y == snakeBody[i].y)
        {
            clearInterval(activeTimer);
            collision = true;
        }
    }
    if (newHead.x < 0 || newHead.x > cols - 1 || newHead.y < 0 || newHead.y > rows - 1)
    {
        clearInterval(activeTimer);
        collision = true;
    }
    return collision;
}

function update(moveSnake){
    if (activeTimer)
    {
        clearInterval(activeTimer);
    }
    activeTimer = setInterval(moveSnake, 200)
}