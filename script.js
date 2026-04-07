// script.js - Portfolio & Mini-Snake

document.addEventListener('DOMContentLoaded', () => {

    console.log("Terminal Sébastien Fataki activé...");

    // --- LE MINI-JEU SNAKE ---
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startGameBtn');

    // Paramètres du jeu
    const gridSize = 20; // Taille d'un carré (serpent/nourriture)
    const tileCount = canvas.width / gridSize; // Nombre de carrés par ligne
    let score = 0;
    let gameInterval;
    let isRunning = false;

    // État du serpent
    let snake = [];
    let food = {};
    let dx = 0; // Direction horizontale
    let dy = 0; // Direction verticale

    // Fonction pour démarrer/réinitialiser le jeu
    function startGame() {
        if (isRunning) return; // Empêche de lancer plusieurs instances
        
        isRunning = true;
        score = 0;
        dx = gridSize;
        dy = 0;
        snake = [
            { x: gridSize * 5, y: gridSize * 7 },
            { x: gridSize * 4, y: gridSize * 7 },
            { x: gridSize * 3, y: gridSize * 7 }
        ];
        
        startBtn.innerText = "Recommencer";
        placeFood();
        
        // Vitesse du jeu (plus le nombre est petit, plus c'est rapide)
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, 120); 
    }

    // Boucle principale du jeu
    function gameLoop() {
        update();
        draw();
    }

    // Mettre à jour la logique (mouvement, collision)
    function update() {
        // Mouvement de la tête
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        
        // Gestion des murs (Traverser les murs)
        if (head.x < 0) head.x = canvas.width - gridSize;
        else if (head.x >= canvas.width) head.x = 0;
        if (head.y < 0) head.y = canvas.height - gridSize;
        else if (head.y >= canvas.height) head.y = 0;

        // Collision avec soi-même
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) {
                gameOver();
                return;
            }
        }

        snake.unshift(head); // Ajouter nouvelle tête

        // Manger la nourriture
        if (head.x === food.x && head.y === food.y) {
            score++;
            placeFood();
        } else {
            snake.pop(); // Retirer la queue si on ne mange pas
        }
    }

    // Dessiner les éléments sur le canvas
    function draw() {
        // Effacer le canvas
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Dessiner le serpent (Vert Néon)
        ctx.fillStyle = '#00ff41';
        snake.forEach((part, index) => {
            // Tête légèrement différente
            if (index === 0) ctx.fillStyle = '#00cc33';
            else ctx.fillStyle = '#00ff41';
            
            ctx.fillRect(part.x, part.y, gridSize - 2, gridSize - 2); // -2 pour l'espace entre carrés
        });

        // Dessiner la nourriture (Rouge)
        ctx.fillStyle = '#ff0055';
        ctx.fillRect(food.x, food.y, gridSize - 2, gridSize - 2);
    }

    // Placer la nourriture aléatoirement
    function placeFood() {
        food = {
            x: Math.floor(Math.random() * tileCount) * gridSize,
            y: Math.floor(Math.random() * tileCount) * gridSize
        };
    }

    function gameOver() {
        isRunning = false;
        clearInterval(gameInterval);
        startBtn.innerText = `GAME OVER (Score: ${score})`;
        
        // Petite lueur rouge sur le bouton
        startBtn.style.borderColor = '#ff0055';
        startBtn.style.color = '#ff0055';
        
        setTimeout(() => {
            startBtn.style.borderColor = '#3498db';
            startBtn.style.color = '#3498db';
            startBtn.innerText = "Lancer_Partie";
        }, 2500);
    }

    // Gestion des contrôles (Z, Q, S, D et Flèches)
    document.addEventListener('keydown', (e) => {
        if (!isRunning) return;

        const key = e.key.toLowerCase();

        // Empêcher le demi-tour instantané
        if ((key === 'q' || e.key === 'ArrowLeft') && dx === 0) {
            dx = -gridSize; dy = 0;
        } else if ((key === 'd' || e.key === 'ArrowRight') && dx === 0) {
            dx = gridSize; dy = 0;
        } else if ((key === 'z' || e.key === 'ArrowUp') && dy === 0) {
            dx = 0; dy = -gridSize;
        } else if ((key === 's' || e.key === 'ArrowDown') && dy === 0) {
            dx = 0; dy = gridSize;
        }
    });

    // Écouteur sur le bouton de démarrage
    startBtn.addEventListener('click', startGame);

});