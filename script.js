import { ticTacRandom } from "./modules/ticTacToe.js";

// Game Object
let game = new ticTacRandom();


//Buttons and elements 
const grid = document.querySelectorAll('[data-button]');
const gameOverMsg = document.getElementById('gameOver');
const resetButton = document.getElementById('resetButton');
const humanButton = document.getElementById('humanOpponent');
const computerButton = document.getElementById('computerOpponent');

// Boolean declarations
let aiOn = false; // Human/Computer Opponent, false default
let forceMove = false; // If computerbutton is clicked twice Ai will make two moves in  a row
let aiIsRand = true; // Ai is random, default

// Grid event listeners
grid.forEach((button, index) => {
    button.addEventListener('click', () => {
        if(game.board[index] !== 0) return;
         
        game.makeMove(index);
        
        switch (game.board[index]) {
            case 1:
                button.innerHTML = 'X';
                break;
            case -1:
                button.innerHTML = 'O';
                break;
            default:
                break;
        }

        switch (game.checkWinner()) {
            case 1:
                gameOverMsg.innerText = 'X is the Winner!';
                break;
            case -1:
                gameOverMsg.innerText = 'O is the Winner!';
            default:
                break;
        }

        if(aiOn) {
 
            let move = game.randomMove();
            game.makeMove(move);

            switch (game.board[move]) {
                case 1:
                    grid[move].innerHTML = 'X';
                    break;
                case -1:
                    grid[move].innerHTML = 'O';
                    break;
                default:
                    break;
            }
        }

        

        switch (game.checkWinner()) {
            case 1:
                gameOverMsg.innerText = 'X is the Winner!';
                break;
            case -1:
                gameOverMsg.innerText = 'O is the Winner!';
            default:
                break;
        }

        if(game.isDraw()){
            gameOverMsg.innerText = 'Draw :('
        }

    })
})


// Reset button event listener
resetButton.addEventListener('click', () => {
    grid.forEach(button => {
        button.innerHTML = '';
    })

    game.reset();
    gameOverMsg.innerText = '';

    aiOn = false;

    humanButton.style.backgroundColor = '#66d96e';
    computerButton.style.backgroundColor = '#abfaf2';

})


// Human/Ai on or off eventlisteners
humanButton.addEventListener('click', () => {
    aiOn = false;

    humanButton.style.backgroundColor = '#66d96e';
    computerButton.style.backgroundColor = '#abfaf2';
})

computerButton.addEventListener('click', () => {

    humanButton.style.backgroundColor = '#abfaf2';
    computerButton.style.backgroundColor = '#66d96e';

    if(aiOn) {

        let move = game.randomMove(true);
        game.makeMove(move);

        switch (game.board[move]) {
            case 1:
                grid[move].innerHTML = 'X';
                break;
            case -1:
                grid[move].innerHTML = 'O';
                break;
            default:
                break;
        }
    }

    

    switch (game.checkWinner()) {
        case 1:
            gameOverMsg.innerText = 'X is the Winner!';
            break;
        case -1:
            gameOverMsg.innerText = 'O is the Winner!';
        default:
            break;
    }

    if(game.isDraw()){
        gameOverMsg.innerText = 'Draw :('
    }

    aiOn = true;
})