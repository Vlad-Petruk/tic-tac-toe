const gameBoardModule = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const markSpot = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return { getBoard, markSpot, resetBoard };
})();

const playerFactory = (name, marker) => {
  const getName = () => name;
  const getMarker = () => marker;

  return { getName, getMarker };
};

const displayControllerModule = (() => {
  const boardContainer = document.getElementById("board-container");
  const winnerDisplay = document.getElementById("winner-display");

  const renderBoard = () => {
    const board = gameBoardModule.getBoard();
    boardContainer.innerHTML = "";

    board.forEach((cell, index) => {
      const cellElement = document.createElement("div");
      cellElement.textContent = cell;
      cellElement.classList.add("cell");
      cellElement.addEventListener("click", () => gameControllerModule.handleCellClick(index));
      boardContainer.appendChild(cellElement);
    });
  };

  const displayWinner = (winner) => {
    winnerDisplay.textContent = `Congratulations, ${winner.getName()}! You won!`;
  };

  const resetDisplay = () => {
    winnerDisplay.textContent = "";
  };

  return { renderBoard, displayWinner, resetDisplay };
})();

const gameControllerModule = (() => {
  let currentPlayer;
  const playerX = playerFactory("Player X", "X");
  const playerO = playerFactory("Computer", "O");

  const getCurrentPlayer = () => currentPlayer;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === playerX ? playerO : playerX;
  };

  const handleCellClick = (index) => {
    const currentPlayer = getCurrentPlayer();

    if (gameBoardModule.markSpot(index, currentPlayer.getMarker())) {
      displayControllerModule.renderBoard();

      if (checkWin()) {
        displayControllerModule.displayWinner(currentPlayer);
      } else if (checkTie()) {
        displayControllerModule.resetDisplay();
        alert("It's a tie!");
      } else {
        switchPlayer();
      }
    }
  };

  const checkWin = () => {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];

    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (
        gameBoardModule.getBoard()[a] &&
        gameBoardModule.getBoard()[a] === gameBoardModule.getBoard()[b] &&
        gameBoardModule.getBoard()[a] === gameBoardModule.getBoard()[c]
      ) {
        return true;
      }
    }

    return false;
  };

  const checkTie = () => {
    return !gameBoardModule.getBoard().includes("");
  };

  const startGame = () => {
    currentPlayer = playerX;
    displayControllerModule.renderBoard();
  };

  const resetGame = () => {
    gameBoardModule.resetBoard();
    displayControllerModule.resetDisplay();
    startGame();
  };

  return { startGame, handleCellClick, resetGame };
})();

document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start-button");
  const restartButton = document.getElementById("restart-button");

  startButton.addEventListener("click", gameControllerModule.startGame);
  restartButton.addEventListener("click", gameControllerModule.resetGame);
});
