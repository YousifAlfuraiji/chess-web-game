function checkRook(board, turn, xi, yi, xf, yf) {
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

function checkQueen(board, turn, xi, yi, xf, yf){
    if(!checkBishop(board, turn, xi, yi, xf, yf) &&
        !checkRook(board, turn, xi, yi, xf, yf)) return false;
    
        return true;
}

function checkBishop(board, turn, xi, yi, xf, yf){
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

function checkPawn(board, turn, xi, yi, xf, yf){
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

export function checkMoveLegal(board, e, prevE, xi, yi, xf, yf, turn) {
    if(e.toElement.className[1] == turn){
        return false;
    }
    if(prevE.toElement.className[0] == 'R' && !checkRook(board, prevE.toElement.className[1], xi, yi, xf, yf)){
        return false;
    }
    if(prevE.toElement.className[0] == 'K' && !checkKing(prevE.toElement.className[1], xi, yi, xf, yf)){

        return false;   
    }
    if(prevE.toElement.className[0] == 'B' && !checkBishop(board, prevE.toElement.className[1], xi, yi, xf, yf)){
        return false;   
    }
    if(prevE.toElement.className[0] == 'Q' && !checkQueen(board, prevE.toElement.className[1], xi, yi, xf, yf)){
        return false;   
    }
    if(prevE.toElement.className[0] == 'N' && !checkKnight(prevE.toElement.className[1], xi, yi, xf, yf)){
        return false;   
    }
    if(prevE.toElement.className[0] == 'P' && !checkPawn(board, prevE.toElement.className[1], xi, yi, xf, yf)){
        return false;   
    }
    return true;
}

export function inCheck(board, turn) {
    for(let x = 0; x < 8; x++) {
        for(let y = 0; y < 8; y++) {
            if(board[y][x] == 'K'+ turn) {
                console.log(x);
                console.log(y);
            }
        }
    }
}