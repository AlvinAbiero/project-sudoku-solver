'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
        const {puzzle, coordinate, value} = req.body

        // Check if all required field are present
        if (!puzzle || !coordinate || !value) {
          return res.json({error: 'Required field(s) missing'})
        }

        // Validate puzzle
        const validation = solver.validate(puzzle);
        if (!validation.valid) {
          return res.json({error: validation.error})
        }
        // Validate coordinate
        if (!/^[A-Ia-i][1-9]$/.test(coordinate)) {
          return res.json({error: 'Invalid coordinate'})
        }

        // Validate value
        if (!/^[1-9]$/.test(value)) {
          return res.json({error: 'Invalid value'})
        }

        // const row = coordinate[0].toUpperCase()
        // const column = coordinate[1]
          const row = coordinate.charAt(0);
          const column = coordinate.charAt(1);

        // Get current value at coordinate
        const board = solver.stringToBoard(puzzle)
        const rowIndex = solver.letterToNumber(row) - 1
        const colIndex = parseInt(column) - 1;
        const currentValue = board[rowIndex][colIndex];

        // If current value at coordinate equals the value being checked, 
      // and it's already placed, it's valid
      if (currentValue === value) {
        return res.json({valid: true})
      }

      // Check for conflicts
      const conflicts = [];

      if (!solver.checkRowPlacement(puzzle, row, column, value)) {
        conflicts.push('row')
      }

      if (!solver.checkColPlacement(puzzle, row, column, value)) {
        conflicts.push('column')
      }

      if (!solver.checkRegionPlacement(puzzle, row, column, value)) {
        conflicts.push('region')
      }

     if (conflicts.length === 0) {
        return res.json({valid: true});
      } else {
        return res.json({valid: false, conflict: conflicts})
      }

  //     // Check row, column, and region placements
  // const rowValid = solver.checkRowPlacement(puzzle, row, column, value);
  // const colValid = solver.checkColPlacement(puzzle, row, column, value);
  // const regionValid = solver.checkRegionPlacement(puzzle, row, column, value);
  
  // if (rowValid && colValid && regionValid) {
  //   return res.json({ valid: true });
  // } else {
  //   // If the placement is invalid, identify which constraints are violated
  //   const conflict = [];
  //   if (!rowValid) conflict.push('row');
  //   if (!colValid) conflict.push('column');
  //   if (!regionValid) conflict.push('region');
    
  //   return res.json({ valid: false, conflict });
  // }

    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const {puzzle} = req.body;

      // Check if puzzle is present
      if (!puzzle) {
        return res.json({error: 'Required field missing'})
      }

      // Check if puzzle has valid characters
      if (!/^[1-9.]+$/.test(puzzle)) {
        return res.json({ error: 'Invalid characters in puzzle' });
      }

      // Check if puzzle is the correct length
      if (puzzle.length !== 81) {
        return res.json({ error: 'Expected puzzle to be 81 characters long' });
      }

      
      // Solve the puzzle
      const solution = solver.solve(puzzle)

      // Return solution or error
      return res.json(solution)

    });
};
