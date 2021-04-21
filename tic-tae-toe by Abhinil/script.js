const gameBoard = (() => {

    const gameBoardContainer = document.querySelector('#gameBoard');
    const squareDiv = document.createElement('div');
    squareDiv.id = 'squareDiv';

    let gameBoardArray = ['', '', '', '', '', '', '', '', ''];

    const changeSquare = (sign, index) => {
        if (gameBoardArray[index] !== '') return false;
        gameBoardArray[index] = sign;
        return true
    };

    const getArray = () => {
        return gameBoardArray;
    }

    const resetArray = () => {
        gameBoardArray = ['', '', '', '', '', '', '', '', ''];
    }

    return {
        getArray,
        squareDiv,
        gameBoardContainer,
        changeSquare,
        resetArray
    };

})();

const gameController = (() => {

    let round = 1;
    let gameOver = false;
    let winner = undefined
    const restartButton = document.querySelector('#restart')

    const playRound = (index) => {
        if (gameBoard.changeSquare(getSign(), index)) {
            if (checkGame(index)) {
                gameOver = true;
                winner = getSign()
                displayController.displayEndMessage(winner)
                return;
            };
            if (round === 9) {
                gameOver = true;
                winner = 'Draw'
                displayController.displayEndMessage(winner)
                return;
            }
            round++
            displayController.displayCurrentMessage()
        };
    };

    const getSign = () => {
        return round % 2 == 0 ? 'O' : 'X';
    };

    const isGameOver = () => {
        return gameOver;
    };

    const checkGame = (index) => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        return winConditions
            .filter((combination) => combination.includes(index))
            .some((possibleCombination) =>
                possibleCombination.every(
                    (index) => gameBoard.getArray()[index] === getSign()
                )
            );
    };

    restartButton.addEventListener('click', () => {
        gameBoard.resetArray()
        round = 1
        winner = undefined
        gameOver = false
        displayController.displayArray()
        displayController.displayCurrentMessage()
    });

    return {
        isGameOver,
        playRound,
        getSign,
    };

})();

const displayController = (() => {

    const currentMessage = document.querySelector('#currentMessage')

    const displayArray = () => {
        gameBoard.gameBoardContainer.innerHTML = ''
        gameBoard.getArray().forEach(element => {
            switch (element) {
                case 'X':
                    gameBoard.squareDiv.innerHTML = '<p>X</p>';
                    break;
                case 'O':
                    gameBoard.squareDiv.innerHTML = '<p>O</p>';
                    break;
                case '':
                    gameBoard.squareDiv.innerHTML = '<p></p>';
                    break;
            }
            gameBoard.gameBoardContainer.appendChild(gameBoard.squareDiv.cloneNode(true))
        });

        const squareDivs = document.querySelectorAll('#squareDiv')

        squareDivs.forEach((square, index) => {
            if (gameController.isGameOver()) return;
            square.addEventListener('click', () => {
                gameController.playRound(index)
                displayArray()
            });
        });
    }

    const displayCurrentMessage = () => {
        currentMessage.textContent = `Player ${gameController.getSign()}'s turn`
    }

    const displayEndMessage = (winner) => {
        if (winner === 'Draw') {
            currentMessage.textContent = `Draw, play again!`;
        } else currentMessage.textContent = `Player ${winner} wins`;
    };

    displayArray()

    return {
        displayEndMessage,
        displayCurrentMessage,
        displayArray
    };

})();