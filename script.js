// ⚠️ ATENÇÃO: SUBSTITUA as URLs abaixo pelas URLs públicas das suas imagens.
const cardImages = [
    // Se não tiver as URLs, o jogo não carregará as imagens!
    { name: 'Aurora', url: '3Aurora.jpeg' },
    { name: 'Aria', url: '6PassaFome.jpg' },
    { name: 'Santiago', url: '4Santiago.jpg' },
    { name: 'Athena', url: '5Athena.jpg' },
    { name: 'Nina', url: '1Nina.jpeg' },
    { name: 'Aquiles', url: '7Aquiles.jpg' },
];

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;
let tries = 0;

const gameContainer = document.querySelector('.game-container');
const triesDisplay = document.getElementById('tries');

// Função para embaralhar o array (Algoritmo Fisher-Yates)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Função para iniciar ou reiniciar o jogo
function startGame() {
    // 1. Resetar variáveis
    cards = [];
    gameContainer.innerHTML = '';
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    matches = 0;
    tries = 0;
    triesDisplay.textContent = tries;

    // 2. Criar pares de cartas e embaralhar
    const cardPairs = [...cardImages, ...cardImages];
    shuffle(cardPairs);

    // 3. Renderizar as cartas no HTML
    cardPairs.forEach(cardData => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.name = cardData.name; // Usado para comparação

        cardElement.innerHTML = `
            <div class="card-face front-face">
                <img src="${cardData.url}" alt="${cardData.name}">
            </div>
            <div class="card-face back-face">
                ?
            </div>
        `;

        cardElement.addEventListener('click', flipCard);
        gameContainer.appendChild(cardElement);
    });
}

// Função principal de virar a carta
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return; 

    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    lockBoard = true; 
    tries++;
    triesDisplay.textContent = tries;

    checkForMatch();
}

// Função para verificar se as cartas são um par
function checkForMatch() {
    const isMatch = firstCard.dataset.name === secondCard.dataset.name;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

// As cartas combinam! Desativa o clique.
function disableCards() {
    matches++;
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    resetBoard();

    // Verifica se o jogo acabou
    if (matches === cardImages.length) {
        setTimeout(() => {
            alert(`🎉 Parabéns! Você encontrou todos os pares em ${tries} tentativas!`);
        }, 500);
    }
}

// As cartas NÃO combinam! Vira de volta.
function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000); // Espera 1 segundo para o jogador ver a carta
}

// Reseta o estado das cartas viradas e desbloqueia o tabuleiro
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

// Inicializa o jogo ao carregar a página
document.addEventListener('DOMContentLoaded', startGame);