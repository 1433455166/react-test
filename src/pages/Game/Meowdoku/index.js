import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './index.css';

const CAT_ICONS = ['🐱', '🐈', '🐈‍⬛', '🐯', '🦁', '🐕', '🐶', '🐻', '🐼'];

const DIFFICULTY_LEVELS = {
  easy: { name: '喵呜 (简单)', holes: 36 },
  medium: { name: '喵喵 (中等)', holes: 46 },
  hard: { name: '猫主子 (困难)', holes: 56 },
};

const Meowdoku = () => {
  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [initialBoard, setInitialBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [gameStatus, setGameStatus] = useState('playing');
  const [difficulty, setDifficulty] = useState('easy');
  const [seconds, setSeconds] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  const generateSolution = useCallback(() => {
    const grid = Array(9).fill(null).map(() => Array(9).fill(0));
    fillBoard(grid);
    return grid;
  }, []);

  const fillBoard = (grid) => {
    const empty = findEmptyCell(grid);
    if (!empty) return true;
    const [row, col] = empty;
    const icons = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (const n of icons) {
      if (isValidPlacement(grid, row, col, n)) {
        grid[row][col] = n;
        if (fillBoard(grid)) return true;
        grid[row][col] = 0;
      }
    }
    return false;
  };

  const findEmptyCell = (grid) => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === 0) return [r, c];
      }
    }
    return null;
  };

  const isValidPlacement = (grid, row, col, num) => {
    for (let i = 0; i < 9; i++) {
      if (grid[row][i] === num) return false;
      if (grid[i][col] === num) return false;
    }
    const br = Math.floor(row / 3) * 3;
    const bc = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[br + i][bc + j] === num) return false;
      }
    }
    return true;
  };

  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const calculateCandidates = useCallback((grid) => {
    const cands = Array(9).fill(null).map(() =>
      Array(9).fill(null).map(() => new Set())
    );
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (grid[r][c] === 0) {
          for (let n = 1; n <= 9; n++) {
            if (isValidPlacement(grid, r, c, n)) cands[r][c].add(n);
          }
        }
      }
    }
    return cands;
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
      const r = Math.floor(Math.random() * 9);
      const c = Math.floor(Math.random() * 9);
      if (puzzle[r][c] !== 0) {
        puzzle[r][c] = 0;
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

  useEffect(() => {
    const handler = (e) => {
      if (gameStatus !== 'playing' || !selectedCell) return;
      const { row, col } = selectedCell;
      if (initialBoard[row][col] !== 0) return;

      const keyMap = {
        '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
        'Backspace': 'erase', 'Delete': 'erase',
        'ArrowUp': 'up', 'ArrowDown': 'down', 'ArrowLeft': 'left', 'ArrowRight': 'right',
      };
      const action = keyMap[e.key];
      if (!action) return;
      e.preventDefault();

      if (action === 'erase') {
        handleErase();
        return;
      }
      if (typeof action === 'number') {
        handleIconInput(action);
        return;
      }

      let nr = row, nc = col;
      if (action === 'up') nr = Math.max(0, row - 1);
      if (action === 'down') nr = Math.min(8, row + 1);
      if (action === 'left') nc = Math.max(0, col - 1);
      if (action === 'right') nc = Math.min(8, col + 1);
      setSelectedCell({ row: nr, col: nc });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [selectedCell, gameStatus, initialBoard]);

  const handleCellClick = (row, col) => {
    if (gameStatus !== 'playing') return;
    setSelectedCell({ row, col });
  };

  const handleIconInput = (num) => {
    if (!selectedCell || gameStatus !== 'playing') return;
    const { row, col } = selectedCell;
    if (initialBoard[row][col] !== 0) return;

    const cellCands = candidates[row]?.[col];
    if (!cellCands || !cellCands.has(num)) return;

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
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (currentBoard[r][c] !== solution[r][c]) return;
      }
    }
    setGameStatus('won');
  };

  const getCellClass = (row, col) => {
    let cls = 'meow-cell';
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
        cls += ' same-icon';
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

    if (value !== 0) {
      return <span className="cell-icon">{CAT_ICONS[value - 1]}</span>;
    }

    if (initial === 0) {
      const cellCands = candidates[row]?.[col];
      if (cellCands && cellCands.size > 0) {
        return (
          <div className="cell-hints">
            {CAT_ICONS.map((icon, idx) => (
              <span
                key={idx}
                className={`hint-icon ${cellCands.has(idx + 1) ? 'visible' : 'hidden'}`}
              >
                {cellCands.has(idx + 1) ? icon : ''}
              </span>
            ))}
          </div>
        );
      }
    }

    return '';
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="meow-container">
      <div className="meow-header">
        <h2 className="meow-title">
          <span className="meow-title-icon">🐱</span> Meowdoku 喵呜数独
        </h2>
        <p className="meow-desc">每行、每列、每个 3×3 猫窝都要有 9 只不同的喵～</p>

        <div className="meow-info">
          <span className="meow-timer">⏱ {formatTime(seconds)}</span>
          <span className="meow-mistakes">❌ {mistakes} 次失误</span>
        </div>

        <div className="meow-difficulty">
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

      <div className="meow-board">
        {board.map((row, ri) =>
          row.map((_, ci) => (
            <div
              key={`${ri}-${ci}`}
              className={getCellClass(ri, ci)}
              onClick={() => handleCellClick(ri, ci)}
            >
              {renderCellContent(ri, ci)}
            </div>
          ))
        )}
      </div>

      <div className="meow-controls">
        <div className="meow-icons">
          {CAT_ICONS.map((icon, idx) => {
            const num = idx + 1;
            const isValid = selectedCandidates.has(num);
            return (
              <button
                key={num}
                className={`icon-btn ${!isValid ? 'disabled' : ''}`}
                onClick={() => handleIconInput(num)}
                title={isValid ? `填入 ${icon}` : `${icon} 这格不能放`}
              >
                {icon}
              </button>
            );
          })}
          <button className="icon-btn erase-btn" onClick={handleErase} title="擦掉">
            🧽
          </button>
        </div>

        <button className="restart-btn" onClick={generatePuzzle}>
          🐾 开新喵局
        </button>
      </div>

      {gameStatus === 'won' && (
        <div className="game-status-message win-message">
          <div className="win-big">🎉 喵！全窝了！🎉</div>
          <div>用时 {formatTime(seconds)} · 失误 {mistakes} 次</div>
        </div>
      )}
    </div>
  );
};

export default Meowdoku;