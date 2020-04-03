import {checkMoveLegal, inCheck} from './legality-checks.js';



function toAlgebraicNotation(x, y) {
    let aN='  ';
    aN[1] = 8 - y;
    if(x == 0)      aN[0] == 'a';
    else if(x == 1) aN[0] == 'b';
    else if(x == 2) aN[0] == 'c';
    else if(x == 3) aN[0] == 'd';
    else if(x == 4) aN[0] == 'e';
    else if(x == 5) aN[0] == 'f';
    else if(x == 6) aN[0] == 'g';
    else if(x == 7) aN[0] == 'h';

    return aN;
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

var turn; // white's turn
var gameOver = false;
var state; // either 'pick piece' or 'move piece'
var prevE;
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
        

        // Change board look
        e.toElement.className = prevE.toElement.className;
        prevE.toElement.className = 'blank tile';
        prevE.toElement.style.borderColor = 'black';
        prevE.toElement.style.backgroundColor = 'white';

        // Change board var
        board[yf][xf] = board[yi][xi];
        board[yi][xi] = ' ';

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
    }
});
