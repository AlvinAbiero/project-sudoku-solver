const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver;

suite('Unit Tests', () => {
 // Initialize a new solver before running tests
  suiteSetup(function() {
    solver = new Solver();
  });

   test('Logic handles a valid puzzle string of 81 characters', () => {
    const validPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.validate(validPuzzle);
    assert.isTrue(result.valid);
  });

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    const invalidPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37X';
    const result = solver.validate(invalidPuzzle);
    assert.isFalse(result.valid);
    assert.equal(result.error, 'Invalid characters in puzzle');
  });

   test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const shortPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.';
    const result = solver.validate(shortPuzzle);
    assert.isFalse(result.valid);
    assert.equal(result.error, 'Expected puzzle to be 81 characters long');
  });

   test('Logic handles a valid row placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.checkRowPlacement(puzzle, 'A', '2', '3');
    assert.isTrue(result);
  });

 test('Logic handles an invalid row placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.checkRowPlacement(puzzle, 'A', '2', '1');
    assert.isFalse(result);
  });

  test('Logic handles a valid column placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.checkColPlacement(puzzle, 'A', '2', '3');
    assert.isTrue(result);
  });

   test('Logic handles an invalid column placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.checkColPlacement(puzzle, 'A', '2', '7');
    assert.isFalse(result);
  });

   test('Logic handles a valid region (3x3 grid) placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.checkRegionPlacement(puzzle, 'A', '2', '3');
    assert.isTrue(result);
  });

  test('Logic handles an invalid region (3x3 grid) placement', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.checkRegionPlacement(puzzle, 'A', '2', '5');
    assert.isFalse(result);
  });

    test('Valid puzzle strings pass the solver', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const result = solver.solve(puzzle);
    assert.property(result, 'solution');
    assert.equal(result.solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
  });

 test('Invalid puzzle strings fail the solver', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37X';
    const result = solver.solve(puzzle);
    assert.property(result, 'error');
    assert.equal(result.error, 'Invalid characters in puzzle');
  });

    test('Solver returns the expected solution for an incomplete puzzle', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    const expectedSolution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
    const result = solver.solve(puzzle);
    assert.property(result, 'solution');
    assert.equal(result.solution, expectedSolution);
  });
});
