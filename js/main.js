/*----- constants -----*/
const markings = {
    '1': 'X',
    '-1': 'O',
    'null': ''
};

const winConditions = [
    [0,1,2], //Row 1
    [3,4,5], //Row 2
    [6,7,8], //Row 3
    [0,3,6], //Column 1
    [1,4,7], //Column 2
    [2,5,8], //Column 3
    [0,4,8], //Diagonal top to bottom
    [6,4,2]  //Diagonal bottom to top
];

const players = {
    '1': {name: 'Player 1', score: 0},
    '-1': {name: 'Player 2', score: 0}
};


/*----- app's state (variables) -----*/
let boardState, gameWon, catsGame, turn, currentPlayer, winner;
let round = 1;
let animatedEl;


/*----- cached element references -----*/
let gameBoard = document.querySelector('#game-board');
let playAgainBtn = document.querySelector('#play-again-btn');
let gameBoardSections = [...gameBoard.querySelectorAll('div')];
let gameMessageEl = document.querySelector('#game-message');
let scoreboard = document.querySelector('#scoreboard');



/*----- event listeners -----*/
gameBoard.addEventListener('click', handleSelection);
playAgainBtn.addEventListener('click', init);


/*----- functions -----*/
init();

function init() {
    turn = 1;
    boardState = [];
    gameWon = false;
    catsGame = false;
    round % 2 === 1 ? currentPlayer = 1 : currentPlayer = -1;

    //Set boardState to null for every section
    gameBoardSections.forEach(function() {
        boardState.push(null);
    });

    render();
}

function handleSelection(evt) {
    if (boardState[evt.target.id] !== null) return;
    if (gameWon) return;
    console.log(evt.target);
    animatedEl = evt.target;
    boardState[evt.target.id] = currentPlayer;
    turn++;
    evaluateBoard();
    //Checks if the overall round is even or odd and then check the turn for even odd. Tracks who started in the round and changes players accordingly
    round % 2 === 1 ? (turn % 2 === 1) ? currentPlayer = 1 : currentPlayer = -1 : (turn % 2 === 1) ? currentPlayer = -1 : currentPlayer = 1;
    render();
}

function render() {
    gameBoardSections.forEach((section, index) => {
        if (boardState[index] === 1) section.innerHTML = `<div class="fa-solid fa-x"></div>`;
        else if (boardState[index] === -1) section.innerHTML = `<div class="fa-regular fa-circle"></div>`;
        else if (boardState[index] === null) section.innerHTML = '<div class=""></div>';
    });

    console.log(boardState);
    console.log(`Render if game won: ${gameWon}`);
    console.log(`Current Player: ${currentPlayer}`);
    console.log(`Current Turn: ${turn}`);

    if (turn > 1) renderAnimation();
    if (gameWon) renderWinnerMessage();
    else if (catsGame) renderCatsGame();
    else renderTurnMessage();
    playAgainBtn.style.visibility = gameWon || catsGame ? 'visible' : 'hidden';
    if (turn === 1 || catsGame || gameWon) renderScore();
}

function evaluateBoard() {
    winConditions.forEach((winCon) => {
        if (boardState[winCon[0]] === boardState[winCon[1]] && boardState[winCon[1]] === boardState[winCon[2]] && boardState[winCon[0]] !== null) {
            gameWon = true;
            winner = players[currentPlayer];
            winner.score++;
            round++;
            return
        };
    });
    if (!boardState.includes(null)) {
        catsGame = true;
        round++;
        console.log('Cats Game');
    }
}

function renderWinnerMessage() {
    gameMessageEl.innerText = `${winner.name} Won!`;
}

function renderTurnMessage() {
    gameMessageEl.innerText = `${players[currentPlayer].name}'s (${markings[currentPlayer]}) Turn`;
}

function renderCatsGame() {
    gameMessageEl.innerText = "Cats Game!";
}

function renderAnimation() {
    animatedEl.querySelector('div').style = 'animation: placeMarker 100ms forwards';
}

function renderScore() {
    let playerScore = '';
    for (let player in players) {
        console.log(players)
        console.log(Object.getOwnPropertyNames(player));
        playerScore += 
        `<section>
            <p>${players[player].name}</p>
            <p>${players[player].score}</p>
        </section>`;
        scoreboard.innerHTML = playerScore;
    }
}