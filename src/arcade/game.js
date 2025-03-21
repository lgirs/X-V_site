// Pong Invaders - Fixed & Reviewed

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const shrinkerImg = new Image();
shrinkerImg.src = "/arcade/shrinker_ship.png";
const speedBoosterImg = new Image();
speedBoosterImg.src = "/arcade/speed_booster_ship.png";
const missileImg = new Image();
missileImg.src = "/arcade/missile.png";

const paddle = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 30,
    width: 100,
    height: 10,
    speed: 5,
    dx: 0,
    shrink() {
        this.width = Math.max(50, this.width - 5);
    }
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 5,
    dx: 2.5,
    dy: -2.5,
    speedMultiplier: 1.05,
    reset() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.dx = 2.5;
        this.dy = -2.5;
        score -= 3;
    }
};

const enemies = [];
const missiles = [];
const enemyTypes = ["shrinker", "speedBooster"];

function spawnEnemy() {
    const x = 50 + Math.random() * (canvas.width - 100);
    const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    enemies.push({ x, y: 20, width: 40, height: 20, type });
}

function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.y += 0.8;

        if (Math.random() < 0.003) {
            missiles.push({ x: enemy.x + 15, y: enemy.y + 20, width: 5, height: 10 });
        }

        if (enemy.y + enemy.height >= paddle.y &&
            enemy.x + enemy.width > paddle.x &&
            enemy.x < paddle.x + paddle.width) {
            score += 15; // Paddle hit by ship
            enemies.splice(i, 1);
            spawnEnemy();
            continue;
        }

        if (enemy.y >= canvas.height) {
            score -= 3;
            enemies.splice(i, 1);
            spawnEnemy();
        }
    }
}

function updateMissiles() {
    for (let i = missiles.length - 1; i >= 0; i--) {
        const missile = missiles[i];
        missile.y += 2;

        if (missile.y >= canvas.height) {
            missiles.splice(i, 1);
            continue;
        }

        if (missile.y + missile.height >= paddle.y &&
            missile.x > paddle.x &&
            missile.x < paddle.x + paddle.width) {
            score -= 20;
            paddle.shrink();
            missiles.splice(i, 1);
        }
    }
}

let score = 0;
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 30);
}

function checkWallCollision() {
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.dx *= -1;
    }
    if (ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }
    if (ball.y + ball.radius > canvas.height) {
        ball.reset();
    }
}

function checkPaddleCollision() {
    if (ball.y + ball.radius >= paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width) {
        ball.dy *= -1;
        ball.y = paddle.y - ball.radius;
        score += 3;
    }
}

function checkEnemyCollision() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        if (ball.x > enemy.x &&
            ball.x < enemy.x + enemy.width &&
            ball.y - ball.radius < enemy.y + enemy.height &&
            ball.y + ball.radius > enemy.y) {
            enemies.splice(i, 1);
            ball.dy *= -1;
            score += 69;
            spawnEnemy();
            break;
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    enemies.forEach(enemy => {
        const img = enemy.type === "shrinker" ? shrinkerImg : speedBoosterImg;
        ctx.drawImage(img, enemy.x, enemy.y, enemy.width, enemy.height);
    });

    missiles.forEach(missile => {
        ctx.drawImage(missileImg, missile.x, missile.y, missile.width, missile.height);
    });

    drawScore();
}

function update() {
    paddle.x += paddle.dx;
    ball.x += ball.dx;
    ball.y += ball.dy;

    checkWallCollision();
    checkPaddleCollision();
    checkEnemyCollision();
    updateEnemies();
    updateMissiles();
    draw();
    requestAnimationFrame(update);
}

// Restore paddle movement
window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") paddle.dx = -paddle.speed;
    if (e.key === "ArrowRight") paddle.dx = paddle.speed;
});

window.addEventListener("keyup", () => {
    paddle.dx = 0;
});

spawnEnemy();
update();
