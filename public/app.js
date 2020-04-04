import {checkMoveLegal, inCheck} from './legality-checks.js';

const socket = io();

function toAlgebraicNotation(x, y) {
    let index1, index2;
    index2 = 8 - y;

    if(x == 0)      index1 = 'a';
    else if(x == 1) index1 = 'b';
    else if(x == 2) index1 = 'c';
    else if(x == 3) index1 = 'd';
    else if(x == 4) index1 = 'e';
    else if(x == 5) index1 = 'f';
    else if(x == 6) index1 = 'g';
    else if(x == 7) index1 = 'h';

    return index1 + index2;
}

function toBoardInices(aN){
    let y = 8 - aN[1];
    let x = -1;
    if(aN[0] == 'a') x = 0;
    else if(aN[0] == 'b') x = 1;
    else if(aN[0] == 'c') x = 2;
    else if(aN[0] == 'd') x = 3;
    else if(aN[0] == 'e') x = 4;
    else if(aN[0] == 'f') x = 5;
    else if(aN[0] == 'g') x = 6;
    else if(aN[0] == 'h') x = 7;

    return [x, y];

}

function SetUpNewGame() {

    // Functionality adjustment
    board = [   ['Rb', 'Nb', 'Bb', 'Kb', 'Qb', 'Bb', 'Nb', 'Rb'],
                ['Pbf', 'Pbf', 'Pbf', 'Pbf', 'Pbf', 'Pbf', 'Pbf', 'Pbf'],
                [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
                ['Pwf', 'Pwf', 'Pwf', 'Pwf', 'Pwf', 'Pwf', 'Pwf', 'Pwf'],
                ['Rw', 'Nw', 'Bw', 'Kw', 'Qw', 'Bw', 'Nw', 'Rw']];
    
    turn = 'w';
    gameOver = false;
    state = 'pick piece'; 

    // DOM adjustment
    const boardItems = document.querySelectorAll('.tile');
    boardItems.forEach(boardItem => {
        let [x, y] = toBoardInices(boardItem.id);
        if(board[y][x] == ' ') 
            boardItem.className = 'blank tile';
        else 
            boardItem.className = board[y][x] + ' tile';
    })

}



var board;

var turn; // player's turn
var gameOver = false;
var state; // either 'pick piece' or 'move piece'
var prevE; // keep track of previous events during clicking
SetUpNewGame();

const boardContainer = document.getElementById('board');
const newgameElement = document.getElementsByClassName('newgame')[0];

newgameElement.addEventListener("click", function(event){
     SetUpNewGame();
     document.getElementsByClassName("alert")[0].innerHTML = "Starting new game. White's turn";
});


// Listen to player input
boardContainer.addEventListener('click', function(e){

    // During the picking piece phase, ensure that white can only move white pieces
    if(state == 'pick piece' && e.toElement.className[1] == turn){
        e.toElement.style.backgroundColor = '#2ecc71';
        prevE = e;
        state ='move piece';
    }
    else if(state == 'move piece'){
        
        let [xi, yi] = toBoardInices(prevE.toElement.id);
        let [xf, yf] = toBoardInices(e.toElement.id);

        if(!checkMoveLegal(board, e, prevE, xi, yi, xf, yf, turn)) {
            document.getElementsByClassName("alert")[0].innerHTML = "Illegal Move. Retry.";
            state ='pick piece';
            prevE.toElement.style.backgroundColor = 'white';
            return;
        }
        inCheck(board, turn);


        socket.emit('made-move', {xi: xi, xf: xf, yi: yi, yf: yf});
        
        const from = prevE.toElement;
        const to = e.toElement;
        
        changeBoard(from, to, xi, xf, yi, yf);

        // Change turns
        if(turn == 'w'){
            turn = 'b';
            document.getElementsByClassName("alert")[0].innerHTML = "Black's Turn";
        }
        else{
            turn = 'w';
            document.getElementsByClassName("alert")[0].innerHTML = "White's Turn";
        }

        state = 'pick piece';
        console.log(board);
    }
});


socket.on('apply-move', move => {
    const fromAN = toAlgebraicNotation(move.xi, move.yi);
    const from = document.getElementById(fromAN);

    const toAN = toAlgebraicNotation(move.xf, move.yf);
    const to = document.getElementById(toAN);

    changeBoard(from, to, move.xi, move.xf, move.yi, move.yf);

});



function changeBoard(from, to, xi, xf, yi, yf) {

    // Change board look
    to.className = from.className;
    from.className = 'blank tile';
    from.style.backgroundColor = 'white';

    // Change board var
    board[yf][xf] = board[yi][xi];
    board[yi][xi] = ' ';
}