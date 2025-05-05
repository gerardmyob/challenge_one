const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

const colors = {
    background: '#120029',
    player: '#d896ff',
    obstacle: '#8a2be2',
    ground: '#4b0082',
    stars: '#ffffff',
    scoreText: '#d896ff',
    menuText: '#ffffff'
};

let player, obstacles, stars, frame, gameSpeed, score, isGameRunning;

function resetGame() {
    player = {
        x: 50,
        y: canvas.height - 60,
        width: 40,
        height: 40,
        dy: 0,
        gravity: 0.5,
        jumpStrength: -10,
        isJumping: false
    };

    obstacles = [];
    stars = [];
    frame = 0;
    gameSpeed = 3;
    score = 0;
    isGameRunning = false;

    for (let i = 0; i < 50; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * (canvas.height - 60),
            size: Math.random() * 3
        });
    }
}

function drawBackground() {
    ctx.fillStyle = colors.stars;
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = colors.ground;
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
}

function updateStars() {
    stars.forEach(star => {
        star.x -= gameSpeed * 0.3;
        if (star.x < 0) {
            star.x = canvas.width;
            star.y = Math.random() * (canvas.height - 60);
        }
    });
}

function drawPlayer() {
    ctx.fillStyle = colors.player;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = '#000';
    ctx.fillRect(player.x + 25, player.y + 10, 8, 8);
}

function updatePlayer() {
    if (player.isJumping) {
        player.dy += player.gravity;
        player.y += player.dy;

        if (player.y >= canvas.height - player.height - 20) {
            player.y = canvas.height - player.height - 20;
            player.isJumping = false;
            player.dy = 0;
        }
    }
}

function createObstacle() {
    if (frame % 120 === 0) {
        const height = 20 + Math.random() * 30;
        obstacles.push({
            x: canvas.width,
            y: canvas.height - height - 20,
            width: 20,
            height: height
        });
    }
}

function drawObstacles() {
    ctx.fillStyle = colors.obstacle;
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x -= gameSpeed;
    });

    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

function detectCollision() {
    obstacles.forEach(obstacle => {
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            isGameRunning = false;
        }
    });
}

function drawScore() {
    ctx.fillStyle = colors.scoreText;
    ctx.font = '20px PressStart2P';
    ctx.fillText(`Score: ${score}`, 50, 20); // Adjusted y position from 30 to 50
}

function drawMenu() {
    ctx.fillStyle = colors.menuText;
    ctx.font = '20px PressStart2P';
    ctx.textAlign = 'center';
    ctx.fillText('Press Space or Up Arrow to Start', canvas.width / 2, canvas.height / 2);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    updateStars();

    if (isGameRunning) {
        drawPlayer();
        updatePlayer();

        createObstacle();
        drawObstacles();
        updateObstacles();

        detectCollision();

        drawScore();

        score++;
        frame++;
    } else {
        drawMenu();
    }

    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if ((e.code === 'Space' || e.code === 'ArrowUp')) {
        if (!isGameRunning) {
            resetGame();
            isGameRunning = true;
        } else if (!player.isJumping) {
            player.isJumping = true;
            player.dy = player.jumpStrength;
        }
    }
});

resetGame();
gameLoop();