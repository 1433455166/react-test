import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './index.css';

const DIFFICULTY_LEVELS = {
  easy: { name: '简单', holes: 36 },
  medium: { name: '中等', holes: 46 },
  hard: { name: '困难', holes: 56 },
};

const Sudoku = () => {
  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [gameStatus, setGameStatus] = useState('playing');
  const [difficulty, setDifficulty] = useState('easy');
  const [seconds, setSeconds] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  const generateSolution = useCallback(() => {
    const board = Array(9)
      .fill(null)
      .map(() => Array(9).fill(0));
    fillBoard(board);
    return board;
  }, []);

  const fillBoard = (board) => {
    const emptyCell = findEmptyCell(board);
    if (!emptyCell) return true;

    const [row, col] = emptyCell;
    const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    for (const num of numbers) {
      if (isValidPlacement(board, row, col, num)) {
        board[row][col] = num;
        if (fillBoard(board)) return true;
        board[row][col] = 0;
      }
    }
    return false;
  };

  const findEmptyCell = (board) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) return [row, col];
      }
    }
    return null;
  };

  const isValidPlacement = (board, row, col, num) => {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num) return false;
      if (board[i][col] === num) return false;
    }
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] === num) return false;
      }
    }
    return true;
  };

  const shuffle = (array) => {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  const calculateCandidates = useCallback((currentBoard) => {
    const candidates = Array(9).fill(null).map(() =>
      Array(9).fill(null).map(() => new Set())
    );
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (currentBoard[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(currentBoard, row, col, num)) {
              candidates[row][col].add(num);
            }
          }
        }
      }
    }
    return candidates;
  }, []);

  const candidates = useMemo(() => {
    if (board.length === 0) return [];
    return calculateCandidates(board);
  }, [board, calculateCandidates]);

  const selectedCandidates = useMemo(() => {
    if (!selectedCell || candidates.length === 0) return new Set();
    return candidates[selectedCell.row]?.[selectedCell.col] || new Set();
  }, [selectedCell, candidates]);

  const generatePuzzle = useCallback(() => {
    const sol = generateSolution();
    const puzzle = sol.map((row) => [...row]);
    const holes = DIFFICULTY_LEVELS[difficulty].holes;

    let removed = 0;
    while (removed < holes) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (puzzle[row][col] !== 0) {
        puzzle[row][col] = 0;
        removed++;
      }
    }

    setSolution(sol);
    setInitialBoard(puzzle.map((row) => [...row]));
    setBoard(puzzle);
    setSelectedCell(null);
    setGameStatus('playing');
    setSeconds(0);
    setMistakes(0);
  }, [difficulty, generateSolution]);

  useEffect(() => {
    generatePuzzle();
  }, [generatePuzzle]);

  useEffect(() => {
    if (gameStatus !== 'playing') return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [gameStatus]);

  const handleCellClick = (row, col) => {
    if (gameStatus !== 'playing') return;
    setSelectedCell({ row, col });
  };

  const handleNumberInput = (num) => {
    if (!selectedCell || gameStatus !== 'playing') return;
    const { row, col } = selectedCell;
    if (initialBoard[row][col] !== 0) return;

    const cellCandidates = candidates[row]?.[col];
    if (!cellCandidates || !cellCandidates.has(num)) return;

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = num;
    setBoard(newBoard);

    if (num !== solution[row][col]) {
      setMistakes((m) => m + 1);
    }

    checkWin(newBoard);
  };

  const handleErase = () => {
    if (!selectedCell || gameStatus !== 'playing') return;
    const { row, col } = selectedCell;
    if (initialBoard[row][col] !== 0) return;

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = 0;
    setBoard(newBoard);
  };

  const checkWin = (currentBoard) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (currentBoard[row][col] !== solution[row][col]) return;
      }
    }
    setGameStatus('won');
  };

  const getCellClass = (row, col) => {
    let cls = 'sudoku-cell';
    const value = board[row]?.[col];
    const initial = initialBoard[row]?.[col];
    const solutionValue = solution[row]?.[col];

    if (initial !== 0) cls += ' fixed';
    if (value !== 0 && value !== solutionValue && initial === 0) cls += ' error';
    if (selectedCell && selectedCell.row === row && selectedCell.col === col) {
      cls += ' selected';
    }
    if (selectedCell && !(selectedCell.row === row && selectedCell.col === col)) {
      if (value !== 0 && value === board[selectedCell.row][selectedCell.col]) {
        cls += ' same-number';
      }
      if (selectedCell.row === row || selectedCell.col === col) {
        cls += ' highlighted';
      }
      if (
        Math.floor(selectedCell.row / 3) === Math.floor(row / 3) &&
        Math.floor(selectedCell.col / 3) === Math.floor(col / 3)
      ) {
        cls += ' highlighted';
      }
    }
    if (col % 3 === 0 && col !== 0) cls += ' border-left';
    if (row % 3 === 0 && row !== 0) cls += ' border-top';
    return cls;
  };

  const renderCellContent = (row, col) => {
    const value = board[row]?.[col];
    const initial = initialBoard[row]?.[col];
    const cellCandidates = candidates[row]?.[col];

    if (value !== 0) {
      return <span className="cell-value">{value}</span>;
    }

    if (initial === 0 && cellCandidates && cellCandidates.size > 0) {
      const candidateNums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      return (
        <div className="cell-candidates">
          {candidateNums.map((n) => (
            <span
              key={n}
              className={`candidate-num ${cellCandidates.has(n) ? 'visible' : 'hidden'}`}
            >
              {cellCandidates.has(n) ? n : ''}
            </span>
          ))}
        </div>
      );
    }

    return '';
  };

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const numberButtons = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="sudoku-container">
      <div className="sudoku-header">
        <h2 className="sudoku-title">数独游戏</h2>

        <div className="sudoku-info">
          <span className="sudoku-timer">⏱ {formatTime(seconds)}</span>
          <span className="sudoku-mistakes">❌ {mistakes} 错误</span>
        </div>

        <div className="sudoku-difficulty">
          {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
            <button
              key={key}
              className={`difficulty-btn ${difficulty === key ? 'active' : ''}`}
              onClick={() => setDifficulty(key)}
            >
              {level.name}
            </button>
          ))}
        </div>
      </div>

      <div className="sudoku-board">
        {board.map((row, rowIndex) =>
          row.map((value, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getCellClass(rowIndex, colIndex)}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {renderCellContent(rowIndex, colIndex)}
            </div>
          ))
        )}
      </div>

      <div className="sudoku-controls">
        <div className="sudoku-numbers">
          {numberButtons.map((num) => {
            const isValid = selectedCandidates.has(num);
            return (
              <button
                key={num}
                className={`number-btn ${!isValid ? 'disabled' : ''}`}
                onClick={() => handleNumberInput(num)}
                title={isValid ? `填入 ${num}` : `${num} 不可填入此格`}
              >
                {num}
              </button>
            );
          })}
          <button className="number-btn erase-btn" onClick={handleErase}>
            ⌫
          </button>
        </div>

        <button className="restart-btn" onClick={generatePuzzle}>
          新游戏
        </button>
      </div>

      {gameStatus === 'won' && (
        <div className="game-status-message win-message">
          🎉 恭喜完成！用时 {formatTime(seconds)}，错误 {mistakes} 次
        </div>
      )}
    </div>
  );
};

export default Sudoku;