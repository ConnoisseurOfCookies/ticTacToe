


export default class TicTacToe {
    constructor(gameSize = 3) {
        this.gameSize = gameSize;
        this.board = [];
        this.createBoard();

        this.currentPlayer = Players.X;
        
    }

    createBoard() {
        for(let i = 0; i < 9; i++){
            this.board.push(Players.Empty);
        }
    }

    makeMove(move) {
        if(this.isLegal(move)) {
            this.board[move] = this.currentPlayer;
            if(!this.checkWinner()) this.currentPlayer *= -1;
            
        }
        return;
    }

    isLegal(move){
        if(!this.checkWinner()) {
            if(!this.isDraw()) return this.board[move] === Players.Empty;
        }
        return false;
    }

    checkWinner() {
        // Check Horizontal
        for(let i = 0; i < this.gameSize*this.gameSize; i += this.gameSize) {
            let winSum = 0;
            for(let j = 0; j < this.gameSize; j++){
                winSum += this.board[i+j];
                if(Math.abs(winSum) === this.gameSize) return this.currentPlayer;
            }
        }

        // Check Vertical
        for(let i = 0; i < this.gameSize; i++ ) {
            let winSum = 0;
            for(let j = 0; j < this.gameSize*this.gameSize; j += this.gameSize){
                winSum += this.board[i+j];
                if(Math.abs(winSum) === this.gameSize) return this.currentPlayer;
            }
        }

        // Check Cross Sections
        let sum = 0;
        for(let i = 0; i < this.gameSize*this.gameSize; i += this.gameSize +1){
            sum += this.board[i];
            if(Math.abs(sum) === this.gameSize) return this.currentPlayer;
        }
        sum = 0;
        for(let i = this.gameSize-1; i < this.gameSize*this.gameSize-1; i += this.gameSize-1){
            sum += this.board[i];
            if(Math.abs(sum) === this.gameSize) return this.currentPlayer;
        }

        return false;
    }

    isDraw() {
        if(!this.checkWinner() && !this.board.includes(Players.Empty)) return true;
        return false;
    }

    reset() {
        for(let i = 0; i < this.board.length; i++) {
            this.board[i] = Players.Empty;
        }
        this.currentPlayer = Players.X;
    }

};

export class ticTacRandom extends TicTacToe {
    constructor(props){
        super(props);
        this.isAiMove = false;
    }

    /**
     * 
     * @param {bool} moveIsForced - If move is last available move, and player has forced it
     * @returns {number} - Index of move made
     */

    randomMove(moveIsForced = false){
        
        for(let i = 0; i < this.board.length; i++){
            if(this.evaluateBoardR(i) === this.currentPlayer*10) return i;
        }

        let move = Math.floor(Math.random() * 9); 

        while(!this.isLegal(move)){

            move = Math.floor(Math.random() * 9);
            let countEmpty = 0;
            for(let i = 0; i < this.board.length; i++){
                if(this.board[i] === Players.Empty) countEmpty++;
            }
            if((countEmpty === 1 && moveIsForced) || (this.checkWinner() && moveIsForced) || (this.isDraw() && moveIsForced)) return;
            countEmpty = 0;
            if(this.checkWinner() || this.isDraw()) return;
            
        }
        return move;
    }

    evaluateBoardR(move){
        let board = JSON.parse(JSON.stringify(this.board));
        
        if(!this.isLegal(move)) return 0;

        board[move] = this.currentPlayer;

        if(this.checkWinnerFunctionR(board) === Players.X){
            return 10;
        } else if(this.checkWinnerFunctionR(board) === Players.O){
            return -10;
        } 

        return 0;
    }

    checkWinnerFunctionR(board) {
        // Check Horizontal
        for(let i = 0; i < this.gameSize*this.gameSize; i += this.gameSize) {
            let winSum = 0;
            for(let j = 0; j < this.gameSize; j++){
                winSum += board[i+j];
                if(Math.abs(winSum) === this.gameSize) return this.currentPlayer;
            }
        }

        // Check Vertical
        for(let i = 0; i < this.gameSize; i++ ) {
            let winSum = 0;
            for(let j = 0; j < this.gameSize*this.gameSize; j += this.gameSize){
                winSum += board[i+j];
                if(Math.abs(winSum) === this.gameSize) return this.currentPlayer;
            }
        }

        // Check Cross Sections
        let sum = 0;
        for(let i = 0; i < this.gameSize*this.gameSize; i += this.gameSize +1){
            sum += board[i];
            if(Math.abs(sum) === this.gameSize) return this.currentPlayer;
        }
        sum = 0;
        for(let i = this.gameSize-1; i < this.gameSize*this.gameSize-1; i += this.gameSize-1){
            sum += board[i];
            if(Math.abs(sum) === this.gameSize) return this.currentPlayer;
        }

        return 0;
    }
}

const Players = {
    X: 1,
    Empty: 0,
    O: -1
}

const tests = {
    build: {
        game: new TicTacToe(),

    },

    test: {
        gameExists: () => {
            console.assert(tests.build.game, 'Game does not exist');
        },

        gameHasBoard: () => {
            console.assert(tests.build.game.board, 'Board does not exist')
        },

        boardInit: () => {
            let testBoard = new TicTacToe();
            let boardEmpty = true;

            console.assert(testBoard.board.length === 9, `Board length is ${testBoard.board.length}, expected 9`);

            for(let i = 0; i < testBoard.board.length; i++){
                if(testBoard.board[i] !== Players.Empty) boardEmpty = false;
            }

            console.assert(boardEmpty, 'Board initialized with incorrect values')
        },

        makesMove: () => {
            for(let i = 0; i < 6; i++) {
                let playerState = tests.build.game.currentPlayer;
                tests.build.game.makeMove(i);
                console.assert(tests.build.game.currentPlayer === playerState *-1, 'Player does not update');
            }

            console.assert(JSON.stringify(tests.build.game.board) === JSON.stringify([Players.X, Players.O, Players.X, Players.O, Players.X, Players.O, Players.Empty, Players.Empty, Players.Empty]), 'Does not make moves');


            //Initialize to empty
            tests.build.game.reset();
        },

        checkWinstate: () => {
            let x = 1;
            let nil = 0;
            let winStates = [[x, x, x, nil, nil, nil, nil, nil, nil], [nil, nil, nil, x, x, x, nil, nil, nil], [nil, nil, nil, nil, nil, nil, x, x, x], [x, nil, nil, x, nil, nil, x, nil, nil], [nil, x, nil, nil, x, nil, nil, x, nil], [nil, nil, x, nil, nil, x, nil, nil, x], [x, nil, nil, nil, x, nil, nil, nil, x], [nil, nil, x, nil, x, nil, x, nil, nil]];
            for(let i = 0; i < 8; i++){
                tests.build.game.board = JSON.stringify(winStates[i]);
                tests.build.game.board = JSON.parse(tests.build.game.board);

                console.assert(tests.build.game.checkWinner(), 'Winstate should be true at ' + i);
            }

            tests.build.game.reset();
        },

        checkDraw: () => {
            let x = 1;
            let o = -1;
            let drawTestCases = [[x, x, o, o, x, x,x, o, o], [ o, x, o, x, o, o, x, o, x ]];
            for(let i = 0; i < drawTestCases.length; i++){
                tests.build.game.board = JSON.parse(JSON.stringify(drawTestCases[i]));
                console.assert(tests.build.game.isDraw(), `Test case ${i} should be a draw`);
            }
        }
    },

    runTests: () => {
        tests.test.gameExists();
        tests.test.gameHasBoard();
        tests.test.boardInit();
        tests.test.makesMove();
        tests.test.checkWinstate();
        tests.test.checkDraw();
    }
};


const randomTests = {
    build: new ticTacRandom(),
    tests: {
        objectExists: () => {
            console.assert(randomTests.build, 'Class does not exist');
        },
        returnsRandomInRange: () => {
            for(let i = 0; i < 1000; i++){
                let a = randomTests.build.randomMove();
                console.assert(a <= 8 && a >= 0, 'Rand nr out of range');
            }
        }
    },
    
    test: () => {
        randomTests.tests.objectExists();
        randomTests.tests.returnsRandomInRange();
    }
}


export class ticTacAI extends ticTacRandom {
    constructor(gameSize = 3) {
        super(gameSize);
    }

    playerToMove(){
        let numX = 0;
        let numO = 0;
        let numEmpty = 0;
        for(let i = 0; i < this.board.length; i++){
            if(this.board[i] === Players.X) numX++;
            if(this.board[i] === Players.O) numO++;
            if(this.board[i] === Players.Empty) numEmpty++;
        }
        if(!this.board.includes(Players.Empty)) return;
        if(numEmpty === this.board.length) return Players.X;
        if(numX === numO) return Players.X;
        if(numX > numO) return Players.O;
    }

    makePerfectMove(){

    }

    // findBestMove(board, currentPlayer){
    //     let bestMove = null;
    //     let boardTempState1 = [...board]
    //     let boardTempState2 = [...board];
    //     let countMoves = 0;
    //     for(let i = 0; i < board.length; i++){
            
    //         if(this.isLegalFunction(i, board)){ // If move is legal
    //             countMoves++; // Count legal moves, assign first legal move to tempState1
    //             if(countMoves === 1){ 
    //             boardTempState1 = this.makeMoveFunction(boardTempState1, [...board], currentPlayer);
                
    //         }
    //             // If boardState with move i is higher than current, update bestmove
    //             if(this.evaluateBoard(this.makeMoveFunction(i, boardTempState2, currentPlayer)) > this.evaluateBoard(boardTempState1)){
    //                 bestMove = i;
    //             }
    //         }
    //     }
    // }

/**
 * @param {number} move - Takes the next move, 
 * @returns {number} - returns 10 if X wins, 0 if neither wins, -10 if O wins
 */

    evaluateBoard(move){
        let board = JSON.parse(JSON.stringify(this.board));
        
        if(!this.isLegal(move)) return 0;

        board[move] = this.currentPlayer;

        if(this.checkWinnerFunctionR(board) === Players.X){
            return 10;
        } else if(this.checkWinnerFunctionR(board) === Players.O){
            return -10;
        } 

        return 0;
    }

     miniMax(depth, nodeIndex, isMaxPlayer, scores, treeMaxHeight){
        if(depth === treeMaxHeight || this.checkWinner() || this.isDraw()) return scores[nodeIndex];

        if(isMaxPlayer){
            return Math.max(this.miniMax(depth+1, nodeIndex*2 + 1, false, scores, treeMaxHeight), this.miniMax(depth+1, nodeIndex*2 + 1, false, scores, treeMaxHeight));
        } else {
            return Math.min(this.miniMax(depth+1, nodeIndex*2 + 1, true, scores, treeMaxHeight), this.miniMaxtreeMaxHeight(depth+1, nodeIndex*2 + 1, true, scores, treeMaxHeight));
        }
    
    }

    bCheckWinner() {
        // Check Horizontal
        for(let i = 0; i < this.gameSize*this.gameSize; i += this.gameSize) {
            let winSum = 0;
            for(let j = 0; j < this.gameSize; j++){
                winSum += this.board[i+j];
                if(Math.abs(winSum) === this.gameSize) return true;
            }
        }

        // Check Vertical
        for(let i = 0; i < this.gameSize; i++ ) {
            let winSum = 0;
            for(let j = 0; j < this.gameSize*this.gameSize; j += this.gameSize){
                winSum += this.board[i+j];
                if(Math.abs(winSum) === this.gameSize) return true;
            }
        }

        // Check Cross Sections
        let sum = 0;
        for(let i = 0; i < this.gameSize*this.gameSize; i += this.gameSize +1){
            sum += this.board[i];
            if(Math.abs(sum) === this.gameSize) return true;
        }
        sum = 0;
        for(let i = this.gameSize-1; i < this.gameSize*this.gameSize-1; i += this.gameSize-1){
            sum += this.board[i];
            if(Math.abs(sum) === this.gameSize) return true;
        }

        return false;
    }

    checkWinnerFunction(board) {
        // Check Horizontal
        for(let i = 0; i < this.gameSize*this.gameSize; i += this.gameSize) {
            let winSum = 0;
            for(let j = 0; j < this.gameSize; j++){
                winSum += board[i+j];
                if(Math.abs(winSum) === this.gameSize) return this.currentPlayer;
            }
        }

        // Check Vertical
        for(let i = 0; i < this.gameSize; i++ ) {
            let winSum = 0;
            for(let j = 0; j < this.gameSize*this.gameSize; j += this.gameSize){
                winSum += board[i+j];
                if(Math.abs(winSum) === this.gameSize) return this.currentPlayer;
            }
        }

        // Check Cross Sections
        let sum = 0;
        for(let i = 0; i < this.gameSize*this.gameSize; i += this.gameSize +1){
            sum += board[i];
            if(Math.abs(sum) === this.gameSize) return this.currentPlayer;
        }
        sum = 0;
        for(let i = this.gameSize-1; i < this.gameSize*this.gameSize-1; i += this.gameSize-1){
            sum += board[i];
            if(Math.abs(sum) === this.gameSize) return this.currentPlayer;
        }

        return false;
    }

    isLegalFunction(move, board){
        if(!this.checkWinnerFunction(board)) {
            if(!this.isDrawFunction(board)) return board[move] === Players.Empty;
        }
        return false;
    }

    isDrawFunction(board) {
        if(!this.checkWinnerFunction(board) && !board.includes(Players.Empty)) return true;
        return false;
    }

    // Potential issue with currentPlayer
    makeMoveFunction(move, board, currentPlayer) {
        if(this.isLegalFunction(move, board)) {
            this.board[move] = currentPlayer;
            if(!this.checkWinnerFunction(board)) return;
            
        }
        return board;
    }
}

const aiTests = {
    ai: new ticTacAI(),
    tests: {
        gameExists(){
            console.assert(aiTests.ai, 'Game does not exist');
        },
        playerToMove(){
            let x = Players.X;
            let o = Players.O;
            let nil = Players.Empty;
            const testsExpectX = [[x, o, nil, nil, nil, nil, nil, nil, nil], [nil, nil, nil, x, o, x, o, nil, nil]]
            for(let i = 0; i < testsExpectX.length; i++){
                aiTests.ai.board = JSON.parse(JSON.stringify(testsExpectX[i]));
                console.assert(aiTests.ai.playerToMove() === Players.X, `Returns ${aiTests.ai.playerToMove()} when expecting ${Players.X} at test nr: ${i+1}`)
            }
            aiTests.ai.reset();
            
        },
        
    },

    test: () => {
        aiTests.tests.gameExists();
        aiTests.tests.playerToMove();
    }
};
