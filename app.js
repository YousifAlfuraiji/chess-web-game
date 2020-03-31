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

function initialize(){
    const boardItems = document.querySelectorAll('.tile');
    boardItems.forEach(boardItem => {
        let [x, y] = toBoardInices(boardItem.id);
        if(board[y][x] == ' ') 
            boardItem.className = 'blank tile';
        else 
            boardItem.className = board[y][x] + ' tile';
    })
}

function checkRook(turn, xi, yi, xf, yf) {
    if(xi == xf){
        let yinc = 1
        if(yi < yf) yinc = 1;
        else if(yi > yf) yinc = -1;
        for( let y = yi + yinc; y !=yf; y += yinc){
            if(board[y][xi] != ' ') return false;
        }
        return true;
    }
    else if(yi == yf){
        let xinc = 1;
        if(xi < xf) xinc = 1;
        else if(xi > xf) xinc = -1;
        for(let x = xi + xinc; x != xf; x += xinc){
            if(board[yi][x] != ' ') return false;
        }
        return true;
    }
    else return false
}
function checkKnight(turn, xi, yi, xf, yf){
    if(Math.abs(xf-xi) == 1 && Math.abs(yf-yi) == 2) return true;
    if(Math.abs(yf-yi) == 1 && Math.abs(xf-xi) == 2) return true;
    return false;
}

function checkKing(turn, xi, yi, xf, yf){
    if(Math.abs(xf-xi) > 1 || Math.abs(yf-yi) > 1) return false;
    return true;
}

function checkQueen(turn, xi, yi, xf, yf){
    if(!checkBishop(turn, xi, yi, xf, yf) &&
        !checkRook(turn, xi, yi, xf, yf)) return false;
    
        return true;
}

function checkBishop(turn, xi, yi, xf, yf){
    let xinc = 1;
    if(xi < xf) xinc = 1;
    else if(xi > xf) xinc = -1;
    
    let yinc = 1;
    if(yi < yf) yinc = 1;
    else if(yi > yf) yinc = -1;
    
    let x = xi + xinc;
    let y = yi + yinc;

    while(x <= 7 && x >= 0 && y <= 7 && y >= 0){
        if(x == xf && y == yf) return true;
        else if(board[y][x] != ' ') return false;
        x += xinc;
        y += yinc;
    }
    return false;
}

function checkPawn(turn, xi, yi, xf, yf){
    let incr = 0;
    if(turn == 'w') incr = -1;
    else incr = 1;
    if(board[yi][xi][2] == 'f' && xf == xi && Math.abs(yf-yi) <=2){
        board[yi][xi] = 'P'+ turn + 's'
        return true;
    }
    if(xf == xi && yf == yi + incr && board[yf][xf] == ' ') return true;
    if(Math.abs(xf-xi) == 1 && yf == yi + incr && board[yf][xf] != ' ' && board[yf][xf][1] != turn) return true;
    
    
    return false;
}

function SetUpNewGame() {
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
}



var board;

var turn; // white's turn
var gameOver = false;
var state; // either 'pick piece' or 'move piece'
var prevE;
SetUpNewGame();
initialize();

gameContainer = document.getElementById('game');
newgameElement = document.getElementsByClassName('newgame')[0];

newgameElement.addEventListener("click", function(event){
     console.log("Starting New Game");
     SetUpNewGame();
     initialize();
     document.getElementsByClassName("alert")[0].innerHTML = "Starting new game.";
});


// Listen to player input
gameContainer.addEventListener('click', function(e){

    if(e.toElement.classList.item(1) != 'tile'){
        return;
    }
    if(state == 'pick piece' && e.toElement.className[1] == turn){
        // e.toElement.style.borderColor = 'red';
        e.toElement.style.backgroundColor = 'red';
        prevE = e;
        state ='move piece';
    }
    else if(state == 'move piece'){
        
        let [xi, yi] = toBoardInices(prevE.toElement.id);
        let [xf, yf] = toBoardInices(e.toElement.id);


        if(e.toElement.className[1] == turn){
            document.getElementsByClassName("alert")[0].innerHTML = "Illegal Move. Retry.";
            state ='pick piece';
            // prevE.toElement.style.borderColor = 'black';
            prevE.toElement.style.backgroundColor = 'white';
            return;
        }
        if(prevE.toElement.className[0] == 'R' && !checkRook(prevE.toElement.className[1], xi, yi, xf, yf)){
            document.getElementsByClassName("alert")[0].innerHTML = "Illegal Move. Retry.";
            state ='pick piece';
            // prevE.toElement.style.borderColor = 'black';
            prevE.toElement.style.backgroundColor = 'white';
            return;
        }
        if(prevE.toElement.className[0] == 'K' && !checkKing(prevE.toElement.className[1], xi, yi, xf, yf)){
            document.getElementsByClassName("alert")[0].innerHTML = "Illegal Move. Retry.";
            state ='pick piece';
            // prevE.toElement.style.borderColor = 'black';
            prevE.toElement.style.backgroundColor = 'white';
            return;   
        }
        if(prevE.toElement.className[0] == 'B' && !checkBishop(prevE.toElement.className[1], xi, yi, xf, yf)){
            document.getElementsByClassName("alert")[0].innerHTML = "Illegal Move. Retry.";
            state ='pick piece';
            // prevE.toElement.style.borderColor = 'black';
            prevE.toElement.style.backgroundColor = 'white';
            return;   
        }
        if(prevE.toElement.className[0] == 'Q' && !checkQueen(prevE.toElement.className[1], xi, yi, xf, yf)){
            document.getElementsByClassName("alert")[0].innerHTML = "Illegal Move. Retry.";
            state ='pick piece';
            // prevE.toElement.style.borderColor = 'black';
            prevE.toElement.style.backgroundColor = 'white';
            return;   
        }
        if(prevE.toElement.className[0] == 'N' && !checkKnight(prevE.toElement.className[1], xi, yi, xf, yf)){
            document.getElementsByClassName("alert")[0].innerHTML = "Illegal Move. Retry.";
            state ='pick piece';
            // prevE.toElement.style.borderColor = 'black';
            prevE.toElement.style.backgroundColor = 'white';
            return;   
        }
        if(prevE.toElement.className[0] == 'P' && !checkPawn(prevE.toElement.className[1], xi, yi, xf, yf)){
            document.getElementsByClassName("alert")[0].innerHTML = "Illegal Move. Retry.";
            state ='pick piece';
            // prevE.toElement.style.borderColor = 'black';
            prevE.toElement.style.backgroundColor = 'white';
            return;   
        }

        // Change board look
        //e.toElement.name = prevE.toElement.name;
        e.toElement.className = prevE.toElement.className;
        //prevE.toElement.name = '';
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
