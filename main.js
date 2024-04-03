const candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];
let board = [];
const rows = 9;
const columns = 9;
let score;
let highScore = parseInt(localStorage.getItem("highScore")) || 0;
let turns = 10;

let currentTile;
let otherTile;

window.onload = function () {
  score = 0;
  startGame();
  // 1/10 of a second
  setInterval(function () {
    crushCandy();
    slideCandy();
    generateCandy();
  }, 100);
};

const container = document.querySelector(".container");
const boardEl = document.querySelector("#board");
const failureAlertEl = document.querySelector(".failure_alert");
const successAlertEl = document.querySelector(".success_alert");
const restartBtn = document.querySelector("#restart");
const replayBtn = document.querySelector("#replay");

function randomCandy() {
  return candies[Math.floor(Math.random() * candies.length)]; // 0-5.99
}

function startGame() {
  // initialize the board by generating random candies and placing them on the board
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("img");
      tile.id = r.toString() + "." + c.toString();
      tile.src = "./images/" + randomCandy() + ".png";

      //
      // Drag functionality
      tile.addEventListener("dragstart", dragStart); // click on a candy, initialize drag process
      tile.addEventListener("dragover", dragOver); //clicking on a candy, moving mouse to drag the candy
      tile.addEventListener("dragenter", dragEnter); //dragging candy onto another candy
      tile.addEventListener("dragleave", dragLeave); //leave candy onto another candy
      tile.addEventListener("drop", dragDrop); // dropping candy over another candy
      tile.addEventListener("dragend", dragEnd); // after drag process completed,we swap candies

      document.getElementById("board").append(tile);
      row.push(tile);
    }
    board.push(row);
  }
}

function dragStart() {
  // this refers to tile that was clicked on for dragging
  currentTile = this;
  return true;
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
}

function dragLeave() {
  console.log("dragleave");
}

function dragDrop() {
  //this refers to the target tile that was dropped on
  otherTile = this;
}

function dragEnd() {
  // if (currentTile.src.includes("blank") || otherTile.src.includes("blank")) {
  //   return;
  // }

  let currentCoords = currentTile.id.split("."); // id='0-0' => ['0','0']
  let r = parseInt(currentCoords[0]);
  let c = parseInt(currentCoords[1]);

  let otherCoords = otherTile.id.split(".");
  let r2 = parseInt(otherCoords[0]);
  let c2 = parseInt(otherCoords[1]);

  let moveLeft = c2 === c - 1 && r2 === r;
  let moveRight = c2 === c + 1 && r2 === r;
  let moveUp = r2 === r - 1 && c2 === c;
  let moveDown = r2 === r + 1 && c2 === c;

  let isAdjacent = moveLeft || moveRight || moveUp || moveDown;
  if (isAdjacent) {
    let currentImg = currentTile.src;
    let otherImg = otherTile.src;
    currentTile.src = otherImg;
    otherTile.src = currentImg;

    let validMove = checkValid();
    if (!validMove) {
      let currentImg = currentTile.src;
      let otherImg = otherTile.src;
      currentTile.src = otherImg;
      otherTile.src = currentImg;
    }

    return true;
  }

  return false;
}

function crushCandy() {
  //crushFive()
  crushFour();
  crushThree();
  document.getElementById("score").innerText = score;
  document.getElementsByClassName("finalScore").item(0).innerText = score;
  document.getElementsByClassName("finalScore").item(1).innerText = score;
  document.getElementById("turns").innerText = turns;
}

function crushThree() {
  // check rows
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 2; c++) {
      let candy1 = board[r][c];
      let candy2 = board[r][c + 1];
      let candy3 = board[r][c + 2];
      if (
        candy1.src === candy2.src &&
        candy2.src === candy3.src &&
        !candy1.src.includes("blank")
      ) {
        candy1.src = "./images/blank.png";
        candy2.src = "./images/blank.png";
        candy3.src = "./images/blank.png";

        if (dragEnd()) {
          score += 30;
          score > highScore ? localStorage.setItem("highScore", score) : "";
        }
        dragStart() ? turns-- : "";
        turns === 0 ? endGame() : "";
      }
      if (
        (candy1.src.includes("Striped") ||
          candy2.src.includes("Striped") ||
          candy3.src.includes("Striped")) &&
        !candy1.src.includes("blank") &&
        (candy1.src === candy2.src ||
          candy2.src === candy3.src ||
          candy3.src === candy1.src)
      ) {
        destroyRow(r, board);
        if (dragEnd()) {
          score += 60;
          score > highScore ? localStorage.setItem("highScore", score) : "";
        }
        dragStart() ? turns-- : "";
        turns === 0 ? endGame() : "";
      }
    }
  }
  // check columns
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 2; r++) {
      let candy1 = board[r][c];
      let candy2 = board[r + 1][c];
      let candy3 = board[r + 2][c];
      if (
        candy1.src === candy2.src &&
        candy2.src === candy3.src &&
        !candy1.src.includes("blank")
      ) {
        candy1.src = "./images/blank.png";
        candy2.src = "./images/blank.png";
        candy3.src = "./images/blank.png";

        if (dragEnd()) {
          score += 30;
          score > highScore ? localStorage.setItem("highScore", score) : "";
        }
        dragStart() ? turns-- : "";
        turns === 0 ? endGame() : "";
      }
      if (
        (candy1.src.includes("Striped") ||
          candy2.src.includes("Striped") ||
          candy3.src.includes("Striped")) &&
        !candy1.src.includes("blank") &&
        (candy1.src === candy2.src ||
          candy2.src === candy3.src ||
          candy3.src === candy1.src)
      ) {
        destroyColumn(c, board);
        if (dragEnd()) {
          score += 60;
          score > highScore ? localStorage.setItem("highScore", score) : "";
        }
        dragStart() ? turns-- : "";
        turns === 0 ? endGame() : "";
      }
    }
  }
}
function crushFour() {
  // check rows
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 3; c++) {
      let candy1 = board[r][c];
      let candy2 = board[r][c + 1];
      let candy3 = board[r][c + 2];
      let candy4 = board[r][c + 3];
      if (
        candy1.src === candy2.src &&
        candy2.src === candy3.src &&
        candy3.src === candy4.src &&
        !candy1.src.includes("blank")
      ) {
        if (candy1.src.includes("Blue")) {
          candy3.src = "./images/Blue-Striped-Horizontal.png";
        } else if (candy1.src.includes("Red")) {
          candy3.src = "./images/Red-Striped-Horizontal.png";
        } else if (candy1.src.includes("Yellow")) {
          candy3.src = "./images/Yellow-Striped-Horizontal.png";
        } else if (candy1.src.includes("Green")) {
          candy3.src = "./images/Green-Striped-Horizontal.png";
        } else if (candy1.src.includes("Purple")) {
          candy3.src = "./images/Purple-Striped-Horizontal.png";
        } else if (candy1.src.includes("Orange")) {
          candy3.src = "./images/Orange-Striped-Horizontal.png";
        }
        candy1.src = `./images/blank.png`;
        // candy2.src = "./images/Blue-Striped-Vertical.png";
        candy2.src = "./images/blank.png";
        candy4.src = "./images/blank.png";
        if (dragEnd()) {
          score += 50;
          score > highScore ? localStorage.setItem("highScore", score) : "";
        }
        dragStart() ? turns-- : "";
        turns === 0 ? endGame() : "";
      }
    }
  }
  // check columns
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 3; r++) {
      let candy1 = board[r][c];
      let candy2 = board[r + 1][c];
      let candy3 = board[r + 2][c];
      let candy4 = board[r + 3][c];
      if (
        candy1.src === candy2.src &&
        candy2.src === candy3.src &&
        candy3.src === candy4.src &&
        !candy1.src.includes("blank")
      ) {
        if (candy1.src.includes("Blue")) {
          candy2.src = "./images/Blue-Striped-Horizontal.png";
        } else if (candy1.src.includes("Red")) {
          candy2.src = "./images/Red-Striped-Horizontal.png";
        } else if (candy1.src.includes("Yellow")) {
          candy2.src = "./images/Yellow-Striped-Horizontal.png";
        } else if (candy1.src.includes("Green")) {
          candy2.src = "./images/Green-Striped-Horizontal.png";
        } else if (candy1.src.includes("Purple")) {
          candy2.src = "./images/Purple-Striped-Horizontal.png";
        } else if (candy1.src.includes("Orange")) {
          candy2.src = "./images/Orange-Striped-Horizontal.png";
        }
        candy1.src = "./images/blank.png";
        candy3.src = "./images/blank.png";
        candy4.src = "./images/blank.png";
        if (dragEnd()) {
          score += 50;
          score > highScore ? localStorage.setItem("highScore", score) : "";
        }
        dragStart() ? turns-- : "";
        turns === 0 ? endGame() : "";
      }
    }
  }
}
function checkValid() {
  // check rows
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 2; c++) {
      let candy1 = board[r][c];
      let candy2 = board[r][c + 1];
      let candy3 = board[r][c + 2];
      if (
        candy1.src === candy2.src &&
        candy2.src === candy3.src &&
        !candy1.src.includes("blank")
      ) {
        return true;
      }
      if (
        (candy1.src.includes("Striped") ||
          candy2.src.includes("Striped") ||
          candy3.src.includes("Striped")) &&
        !candy1.src.includes("blank") &&
        (candy1.src === candy2.src ||
          candy2.src === candy3.src ||
          candy3.src === candy1.src)
      ) {
        return true;
      }
    }
  }
  // check columns
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 2; r++) {
      let candy1 = board[r][c];
      let candy2 = board[r + 1][c];
      let candy3 = board[r + 2][c];
      if (
        candy1.src === candy2.src &&
        candy2.src === candy3.src &&
        !candy1.src.includes("blank")
      ) {
        return true;
      }
      if (
        (candy1.src.includes("Striped") ||
          candy2.src.includes("Striped") ||
          candy3.src.includes("Striped")) &&
        !candy1.src.includes("blank") &&
        (candy1.src === candy2.src ||
          candy2.src === candy3.src ||
          candy3.src === candy1.src)
      ) {
        return true;
      }
    }
  }

  return false;
}

function slideCandy() {
  // slide candy down
  for (let c = 0; c < columns; c++) {
    let index = rows - 1;
    for (let r = columns - 1; r >= 0; r--) {
      if (!board[r][c].src.includes("blank")) {
        board[index][c].src = board[r][c].src;
        index--;
      }
    }
    for (let r = index; r >= 0; r--) {
      board[r][c].src = "./images/blank.png";
    }
  }
}

function generateCandy() {
  for (let c = 0; c < columns; c++) {
    if (board[0][c].src.includes("blank")) {
      board[0][c].src = "./images/" + randomCandy() + ".png";
    }
  }
}

function endGame() {
  if (turns === 0 && score < highScore) {
    console.log("Game Over. Score: " + score);
    console.log("Game Over. Score: " + highScore);
    failureAlertEl.classList.add("show");
    container.style.filter = "brightness(0.5)";
    restartBtn.addEventListener("click", restartGame);
  } else {
    console.log("win. score: " + score + " highScore: ");

    successAlertEl.classList.add("show");
    container.style.filter = "brightness(0.5)";
    replayBtn.addEventListener("click", restartGame);
  }
}
function restartGame() {
  location.reload();
}

// Function to destroy an entire column
function destroyColumn(columnIndex, board) {
  for (let r = 0; r < rows; r++) {
    board[r][columnIndex].src = "./images/blank.png";
  }
}

// Function to destroy an entire row
function destroyRow(rowIndex, board) {
  for (let c = 0; c < columns; c++) {
    board[rowIndex][c].src = "./images/blank.png";
  }
}
