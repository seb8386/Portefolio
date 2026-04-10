document.addEventListener('DOMContentLoaded', () => {

    console.log("Système Sébastien Fataki opérationnel...");

    // ==========================================
    // 1. COMPTEUR DE VISITEURS
    // ==========================================
    function initVisitorStats() {
        let visits = localStorage.getItem('seb_portfolio_visits');
        
        if (!visits) {
            visits = 127; // Valeur de départ
        } else {
            visits = parseInt(visits) + 1;
        }
        
        localStorage.setItem('seb_portfolio_visits', visits);
        
        const counterElement = document.getElementById('visit-count');
        if (counterElement) {
            counterElement.innerText = visits;
        }
    }
    
    initVisitorStats();

    // ==========================================
    // 2. FORMULAIRE DE CONTACT (AJAX via Formspree)
    // ==========================================
    const form = document.getElementById("my-form");
    const status = document.getElementById("form-status");
    const btnSubmit = document.getElementById("submit-btn");

    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault(); // Empêche le rechargement de la page
            
            btnSubmit.disabled = true;
            btnSubmit.innerText = "Envoi en cours...";
            
            const data = new FormData(event.target);
            
            fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    status.innerHTML = "<span style='color: #00ff41;'>[ ✓ ] Message envoyé avec succès !</span>";
                    form.reset(); // Vide les champs
                } else {
                    status.innerHTML = "<span style='color: #ff0055;'>[ ✗ ] Erreur lors de l'envoi.</span>";
                }
                btnSubmit.disabled = false;
                btnSubmit.innerText = "Envoyer Message";
            }).catch(error => {
                status.innerHTML = "<span style='color: #ff0055;'>[ ✗ ] Problème de connexion réseau.</span>";
                btnSubmit.disabled = false;
                btnSubmit.innerText = "Réessayer";
            });
        });
    }

    // ==========================================
    // 3. LOGIQUE DU MINI-JEU SNAKE
    // ==========================================
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startGameBtn');

    const gridSize = 20;
    const tileCountX = canvas.width / gridSize;
    const tileCountY = canvas.height / gridSize;
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
        startBtn.innerText = "Réinitialiser";
        placeFood();
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, 130);
    }

    function gameLoop() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        // Traversée des murs
        if (head.x < 0) head.x = canvas.width - gridSize;
        else if (head.x >= canvas.width) head.x = 0;
        if (head.y < 0) head.y = canvas.height - gridSize;
        else if (head.y >= canvas.height) head.y = 0;

        // Collision corps
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
        snake.forEach((part) => {
            ctx.fillRect(part.x, part.y, gridSize - 2, gridSize - 2);
        });

        ctx.fillStyle = '#ff0055'; // Nourriture
        ctx.fillRect(food.x, food.y, gridSize - 2, gridSize - 2);
    }

    function placeFood() {
        food = {
            x: Math.floor(Math.random() * tileCountX) * gridSize,
            y: Math.floor(Math.random() * tileCountY) * gridSize
        };
    }

    function gameOver() {
        isRunning = false;
        clearInterval(gameInterval);
        startBtn.innerText = `SCORE: ${score} - REJOUER ?`;
    }

    const handleDirection = (newDx, newDy) => {
        if (!isRunning) return;
        if (newDx !== 0 && dx === 0) { dx = newDx; dy = 0; }
        if (newDy !== 0 && dy === 0) { dx = 0; dy = newDy; }
    };

    // Contrôles Clavier
    document.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (key === 'z' || e.key === 'ArrowUp') handleDirection(0, -gridSize);
        if (key === 's' || e.key === 'ArrowDown') handleDirection(0, gridSize);
        if (key === 'q' || e.key === 'ArrowLeft') handleDirection(-gridSize, 0);
        if (key === 'd' || e.key === 'ArrowRight') handleDirection(gridSize, 0);
    });

    // Contrôles Tactiles
    const btns = {
        'btnUp': [0, -gridSize],
        'btnDown': [0, gridSize],
        'btnLeft': [-gridSize, 0],
        'btnRight': [gridSize, 0]
    };

    Object.keys(btns).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                handleDirection(btns[id][0], btns[id][1]);
            });
        }
    });

    if (startBtn) startBtn.addEventListener('click', startGame);

    // ==========================================
    // 4. NAVIGATION FLUIDE (SMOOTH SCROLL)
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});