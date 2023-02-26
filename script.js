const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Lưu điểm cao nhất 
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = ` Điểm cao nhất: ${highScore}`;

// Chuyển vị trí mồi ngẫu nhiên tử 1 - 30 
const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

// Thông báo khi hết lượt và reset lại lượt chơi
const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Thất bại! Nhấn OK để chơi lại.. ");
    location.reload();
}

// dùng phím lên xuống trái phải để điều khiển
const changeDirection = e => {
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// dùng changeDirection trên mỗi lần bấm phím để chuyển giá trị tập dữ liệu chính dưới dạng đối tượng 
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    if(gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Kiểm tra nếu rắn cắn mồi
    if(snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); // Đẩy vị trí vào gần cơ thể rắn
        score++; // tăng điểm
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }
    // Cập nhật vị trí rắn dựa theo vận tốc hiện tại
    snakeX += velocityX;
    snakeY += velocityY;
    
    // Đẩy cơ thể rắn dài lên một điểm
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; // Đặt thân rắn vào vị trí hiện tại

    // Kiểm tra khi đầu rắn nhô ra khỏi tường, nếu có thì đặt gameOver = true
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        // Thêm một div cho phần cơ thể con rắn
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Kiểm tra nếu rắn cắn bản thân thì đặt gameOver = true
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);