document.addEventListener('DOMContentLoaded', () => {

    console.log("Terminal Sébastien Fataki initialisé...");

    // ==========================================
    // 1. LOGIQUE DU MINI-JEU SNAKE (TACTILE + PC)
    // ==========================================
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startGameBtn');

    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    let score = 0;
    let gameInterval;
    let isRunning = false;

    let snake = [];
    let food = {};
    let dx = 0;
    let dy = 0;

    function startGame() {
        if (isRunning) return;
        isRunning = true;
        score = 0;
        dx = gridSize;
        dy = 0;
        snake = [
            { x: gridSize * 5, y: gridSize * 7 },
            { x: gridSize * 4, y: gridSize * 7 }
        ];
        startBtn.innerText = "Recommencer";
        placeFood();
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, 130);
    }

    function gameLoop() {
        // Mise à jour de la position
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        // Collision Murs (Sortie et réentrée de l'autre côté)
        if (head.x < 0) head.x = canvas.width - gridSize;
        else if (head.x >= canvas.width) head.x = 0;
        if (head.y < 0) head.y = canvas.height - gridSize;
        else if (head.y >= canvas.height) head.y = 0;

        // Collision Corps
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) return gameOver();
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score++;
            placeFood();
        } else {
            snake.pop();
        }

        draw();
    }

    function draw() {
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff41'; // Vert Néon
        snake.forEach((part, index) => {
            ctx.fillRect(part.x, part.y, gridSize - 2, gridSize - 2);
        });

        ctx.fillStyle = '#ff0055'; // Nourriture
        ctx.fillRect(food.x, food.y, gridSize - 2, gridSize - 2);
    }

    function placeFood() {
        food = {
            x: Math.floor(Math.random() * tileCount) * gridSize,
            y: Math.floor(Math.random() * tileCount) * gridSize
        };
    }

    function gameOver() {
        isRunning = false;
        clearInterval(gameInterval);
        startBtn.innerText = `SCORE: ${score} - REJOUER ?`;
    }

    // --- CONTRÔLES (PC & TACTILE) ---
    const handleDirection = (newDx, newDy) => {
        if (!isRunning) return;
        if (newDx !== 0 && dx === 0) { dx = newDx; dy = 0; }
        if (newDy !== 0 && dy === 0) { dx = 0; dy = newDy; }
    };

    // Clavier
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (key === 'z' || e.key === 'ArrowUp') handleDirection(0, -gridSize);
        if (key === 's' || e.key === 'ArrowDown') handleDirection(0, gridSize);
        if (key === 'q' || e.key === 'ArrowLeft') handleDirection(-gridSize, 0);
        if (key === 'd' || e.key === 'ArrowRight') handleDirection(gridSize, 0);
    });

    // Tactile (Boutons mobiles)
    const btnUp = document.getElementById('btnUp');
    const btnDown = document.getElementById('btnDown');
    const btnLeft = document.getElementById('btnLeft');
    const btnRight = document.getElementById('btnRight');

    if(btnUp) btnUp.addEventListener('click', () => handleDirection(0, -gridSize));
    if(btnDown) btnDown.addEventListener('click', () => handleDirection(0, gridSize));
    if(btnLeft) btnLeft.addEventListener('click', () => handleDirection(-gridSize, 0));
    if(btnRight) btnRight.addEventListener('click', () => handleDirection(gridSize, 0));

    startBtn.addEventListener('click', startGame);

    // ==========================================
    // 2. ANIMATIONS SMOOTH SCROLL
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

});