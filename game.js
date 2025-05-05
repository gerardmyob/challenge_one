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
let coins = [];
let coinScore = 0;

function resetGame() {
    player = {
        x: 50,
        y: canvas.height - 30, // Adjusted to align with the ground
        width: 20,
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

function createCoin() {
    if (frame % 150 === 0) { // Create a coin every 150 frames
        coins.push({
            x: canvas.width,
            y: canvas.height - 60 - Math.random() * 100, // Random height above the ground
            size: 10
        });
    }
}

function drawCoins() {
    ctx.fillStyle = '#ffd700'; // Gold color for coins
    coins.forEach(coin => {
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, coin.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

function updateCoins() {
    coins.forEach(coin => {
        coin.x -= gameSpeed; // Move coins to the left
    });

    // Remove coins that go off-screen
    coins = coins.filter(coin => coin.x + coin.size > 0);
}

function detectCoinCollection() {
    coins.forEach((coin, index) => {
        if (
            player.x < coin.x + coin.size &&
            player.x + player.width > coin.x - coin.size &&
            player.y < coin.y + coin.size &&
            player.y + player.height > coin.y - coin.size
        ) {
            coins.splice(index, 1); // Remove the collected coin
            coinScore++; // Increment the coin score
        }
    });
}

function drawCoinScore() {
    ctx.fillStyle = colors.scoreText;
    ctx.font = '20px PressStart2P';
    ctx.fillText(`Coins: ${coinScore}`, 50, 50); // Display coin score
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
    const legHeight = 10;
    const legWidth = 8;
    const bodyWidth = 20;
    const bodyHeight = 30;

    // Draw body
    ctx.fillStyle = colors.player;
    ctx.fillRect(player.x, player.y - bodyHeight, bodyWidth, bodyHeight);

    // Draw head
    ctx.fillStyle = '#fff';
    ctx.fillRect(player.x + 6, player.y - bodyHeight - 10, 8, 8);

    // Animate legs
    const legOffset = Math.sin(frame / 5) * 5; // Oscillate leg position
    ctx.fillStyle = '#4b0082';

    // Left leg
    ctx.fillRect(player.x + 2, player.y - legOffset, legWidth, legHeight);

    // Right leg
    ctx.fillRect(player.x + 10, player.y + legOffset, legWidth, legHeight);
}

function updatePlayer() {
    if (player.isJumping) {
        player.dy += player.gravity;
        player.y += player.dy;

        // Ensure the player lands exactly on the ground
        if (player.y >= canvas.height - player.height - 20) {
            player.y = canvas.height - player.height - 30; // Reset to ground level
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

        createCoin();
        drawCoins();
        updateCoins();
        detectCoinCollection();

        detectCollision();

        drawScore();
        drawCoinScore();

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