// Pong Invaders - Fixed & Improved for X/V Website

// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Load enemy images
const shrinkerImg = new Image();
shrinkerImg.src = "assets/images/shrinker_ship.png";

const speedBoosterImg = new Image();
speedBoosterImg.src = "assets/images/speed_booster_ship.png";

const missileImg = new Image();
missileImg.src = "assets/images/missile.png";

// Paddle setup
const paddle = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 30,
    width: 100,
    height: 10,
    speed: 5, // Slowed down further
    dx: 0,
    shrink: function () {
        this.width = Math.max(50, this.width - 5); // Reduced shrink rate
    }
};

// Ball setup
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 5,
    dx: 2.5, // Slowed down further
    dy: -2.5,
    speedMultiplier: 1.05, // Reduced speed boost per Speed Booster hit
    reset: function() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.dx = 2.5;
        this.dy = -2.5;
        score -= 3; // Losing the ball reduces score
    }
};

// Enemy setup
const enemies = [];
const missiles = [];
const enemyTypes = ["shrinker", "speedBooster"];

function spawnEnemy() {
    let x = 50 + Math.random() * (canvas.width - 100);
    let type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    enemies.push({ x, y: 20, width: 40, height: 20, type });
}

function updateEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].y += 0.8; // Slowed down further
        
        if (Math.random() < 0.003) { // Lowered missile spawn rate
            missiles.push({ x: enemies[i].x + 15, y: enemies[i].y + 20, width: 5, height: 10 });
        }
        
        if (enemies[i].y >= canvas.height) {
            score += 15; // Enemy ship reaching the bottom increases score
            enemies.splice(i, 1);
            spawnEnemy();
        }
    }
}

function updateMissiles() {
    for (let i = 0; i < missiles.length; i++) {
        missiles[i].y += 2; // Missiles move even slower
        
        if (missiles[i].y >= canvas.height) {
            missiles.splice(i, 1);
            continue;
        }
        
        if (
            missiles[i].y + missiles[i].height >= paddle.y &&
            missiles[i].x > paddle.x &&
            missiles[i].x < paddle.x + paddle.width
        ) {
            score -= 20; // Paddle hit by missile reduces score
            paddle.shrink();
            missiles.splice(i, 1);
        }
    }
}

// Scoring System
let score = 0;
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 30);
}

// Keyboard Controls
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") paddle.dx = -paddle.speed;
    if (e.key === "ArrowRight") paddle.dx = paddle.speed;
});

window.addEventListener("keyup", () => {
    paddle.dx = 0;
});

// Prevent ball from leaving screen
function checkWallCollision() {
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.dx *= -1;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }
    if (ball.y + ball.radius > canvas.height) {
        ball.reset(); // Respawn the ball if it goes off the bottom
    }
}

// Check for paddle collision
function checkPaddleCollision() {
    if (
        ball.y + ball.radius >= paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
    ) {
        ball.dy *= -1;
        ball.y = paddle.y - ball.radius; // Prevent sticking to the paddle
        score += 3; // Saving the ball increases score
    }
}

// Check for enemy collision
function checkEnemyCollision() {
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        if (
            ball.x > enemy.x &&
            ball.x < enemy.x + enemy.width &&
            ball.y - ball.radius < enemy.y + enemy.height &&
            ball.y + ball.radius > enemy.y
        ) {
            enemies.splice(i, 1);
            ball.dy *= -1;
            score += 69; // Destroying an enemy increases score
            spawnEnemy();
            break;
        }
    }
}

// Rendering function with pixel-art enemies and missiles
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw paddle
    ctx.fillStyle = "white";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    
    // Draw enemies with images
    enemies.forEach(enemy => {
        let img = enemy.type === "shrinker" ? shrinkerImg : speedBoosterImg;
        ctx.drawImage(img, enemy.x, enemy.y, enemy.width, enemy.height);
    });
    
    // Draw missiles
    missiles.forEach(missile => {
        ctx.drawImage(missileImg, missile.x, missile.y, missile.width, missile.height);
    });
    
    // Draw score
    drawScore();
}

function update() {
    paddle.x += paddle.dx;
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    checkWallCollision(); // Prevent ball from leaving screen
    checkPaddleCollision();
    checkEnemyCollision();
    updateEnemies();
    updateMissiles();
    draw();
    requestAnimationFrame(update);
}

spawnEnemy(); // Now only one enemy spawns at a time
update();
