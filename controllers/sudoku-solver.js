class SudokuSolver {
  validate(puzzleString) {
    // Check if puzzleString exists
    if (!puzzleString) {
      return { valid: false, error: "Required field missing" };
    }

    // Check length
    if (puzzleString.length !== 81) {
      return {
        valid: false,
        error: "Expected puzzle to be 81 characters long",
      };
    }

    // Check for valid characters (only 1-9 and '.')
    if (!/^[1-9.]+$/.test(puzzleString)) {
      return { valid: false, error: "Invalid characters in puzzle" };
    }

    return { valid: true };
  }

  letterToNumber(letter) {
    const letters = {
      A: 1,
      B: 2,
      C: 3,
      D: 4,
      E: 5,
      F: 6,
      G: 7,
      H: 8,
      I: 9,
    };
    return letters[letter];
  }

  checkRowPlacement(puzzleString, row, column, value) {
    // Convert row letter to number (A-I -> 1-9)
    let rowNumber;
    if (typeof row === "string") {
      rowNumber = this.letterToNumber(row.toUpperCase());
    } else {
      rowNumber = row;
    }

    // Convert column from string to number if needed
    let colNumber = parseInt(column);

    // Convert puzzleString to 2D array
    const board = this.stringToBoard(puzzleString);

    // Check if the cell is already filled with this value
    if (board[rowNumber - 1][colNumber - 1] === value.toString()) {
      return true;
    }

    // // Check if value already exists in row
    // for (let col = 0; col < 9; col++) {
    //   if (board[rowNumber - 1][col] === value.toString()) {
    //     return false;
    //   }
    // }

    for (let col = 0; col < 9; col++) {
      if (
        col !== colNumber - 1 &&
        board[rowNumber - 1][col] === value.toString()
      ) {
        return false;
      }
    }

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    // Convert row letter to number (A-I -> 1-9)
    let rowNumber;
    if (typeof row === "string") {
      rowNumber = this.letterToNumber(row.toUpperCase());
    } else {
      rowNumber = row;
    }

    // Convert column from string to number if needed
    let colNumber = parseInt(column);

    // Convert puzzleString to 2D array
    const board = this.stringToBoard(puzzleString);

    // // Check if value already exists in column
    // for (let row = 0; row < 9; row++) {
    //   if (board[row][colNumber - 1] === value.toString()) {
    //     return false;
    //   }
    // }

    // Check if the cell is already filled with this value
    if (board[rowNumber - 1][colNumber - 1] === value.toString()) {
      return true;
    }

    // Check if value exists elsewhere in column
    for (let row = 0; row < 9; row++) {
      if (
        row !== rowNumber - 1 &&
        board[row][colNumber - 1] === value.toString()
      ) {
        return false;
      }
    }

    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    // Convert row letter to number (A-I -> 1-9)
    let rowNumber;
    if (typeof row === "string") {
      rowNumber = this.letterToNumber(row.toUpperCase());
    } else {
      rowNumber = row;
    }

    // Convert column from string to number if needed
    let colNumber = parseInt(column);

    // Convert puzzleString to 2D array
    const board = this.stringToBoard(puzzleString);

    // Check if the cell is already filled with this value
    if (board[rowNumber - 1][colNumber - 1] === value.toString()) {
      return true;
    }

    // Determine the region's starting row and column
    const regionRow = Math.floor((rowNumber - 1) / 3) * 3;
    const regionCol = Math.floor((colNumber - 1) / 3) * 3;

    // // Check if value already exists in region
    // for (let r = 0; r < 3; r++) {
    //   for (let c = 0; c < 3; c++) {
    //     if (board[regionRow + r][regionCol + c] === value.toString()) {
    //       return false;
    //     }
    //   }
    // }

    // Check if value exists elsewhere in region
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const currentRow = regionRow + r;
        const currentCol = regionCol + c;
        if (
          !(currentRow === rowNumber - 1 && currentCol === colNumber - 1) &&
          board[currentRow][currentCol] === value.toString()
        ) {
          return false;
        }
      }
    }

    return true;
  }

  // Helper method to convert string to 2D array
  stringToBoard(puzzleString) {
    const board = [];
    let row = [];

    for (let i = 0; i < puzzleString.length; i++) {
      row.push(puzzleString[i]);
      if ((i + 1) % 9 === 0) {
        board.push(row);
        row = [];
      }
    }

    return board;
  }

  // Helper method to convert 2D array to string
  boardToString(board) {
    return board.flat().join("");
  }

  solve(puzzleString) {
    // Validate the puzzle first
    const validation = this.validate(puzzleString);
    if (!validation.valid) {
      return { error: validation.error };
    }

    // Convert string to 2D array
    const board = this.stringToBoard(puzzleString);

    // Try to solve the puzzle
    if (this.solveBoard(board)) {
      return { solution: this.boardToString(board) };
    } else {
      return { error: "Puzzle cannot be solved" };
    }
  }

  solveBoard(board) {
    // Find an empty cell
    const emptyCell = this.findEmptyCell(board);

    // If no empty cell is found, puzzle is solved
    if (!emptyCell) {
      return true;
    }

    const [row, col] = emptyCell;

    // Try digits 1-9
    for (let num = 1; num <= 9; num++) {
      // Check if placing num at (row, col) is valid
      if (this.isValidPlacement(board, row, col, num.toString())) {
        // Place the number
        board[row][col] = num.toString();

        // Recursively try to solve the rest of the puzzle
        if (this.solveBoard(board)) {
          return true;
        }

        // If placing num doesn't lead to a solution, backtrack
        board[row][col] = ".";
      }
    }

    // No solution found
    return false;
  }

  findEmptyCell(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === ".") {
          return [row, col];
        }
      }
    }
    return null; // No empty cell found
  }

  isValidPlacement(board, row, col, value) {
    // Check row
    for (let c = 0; c < 9; c++) {
      if (board[row][c] === value) {
        return false;
      }
    }

    // Check column
    for (let r = 0; r < 9; r++) {
      if (board[r][col] === value) {
        return false;
      }
    }

    // Check 3x3 region
    const regionRow = Math.floor(row / 3) * 3;
    const regionCol = Math.floor(col / 3) * 3;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[regionRow + r][regionCol + c] === value) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = SudokuSolver;
