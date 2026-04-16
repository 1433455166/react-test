import React, { useState, useEffect } from 'react';
import './index.css';

const DIFFICULTY_LEVELS = {
  beginner: { size: 9, mines: 10, name: '初级' },
  intermediate: { size: 12, mines: 25, name: '中级' },
  expert: { size: 16, mines: 40, name: '高级' }
};

const Minesweeper = () => {
  const [board, setBoard] = useState([]);
  const [gameStatus, setGameStatus] = useState('playing'); // playing, won, lost
  const [flagsCount, setFlagsCount] = useState(0);
  const [difficulty, setDifficulty] = useState('beginner');
  const [firstClick, setFirstClick] = useState(true);

  const currentDifficulty = DIFFICULTY_LEVELS[difficulty];
  const BOARD_SIZE = currentDifficulty.size;
  const MINES_COUNT = currentDifficulty.mines;

  // 初始化游戏板
  const initializeBoard = (firstClickRow = -1, firstClickCol = -1) => {
    const newBoard = Array(BOARD_SIZE).fill().map(() => 
      Array(BOARD_SIZE).fill().map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0
      }))
    );

    // 随机放置地雷，但要确保第一个点击的位置不是地雷
    let minesPlaced = 0;
    while (minesPlaced < MINES_COUNT) {
      const randomRow = Math.floor(Math.random() * BOARD_SIZE);
      const randomCol = Math.floor(Math.random() * BOARD_SIZE);
      
      // 如果是第一次点击，确保不在点击位置及其周围放置地雷
      if (firstClickRow !== -1 && firstClickCol !== -1) {
        let isNearFirstClick = false;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const checkRow = firstClickRow + i;
            const checkCol = firstClickCol + j;
            if (checkRow === randomRow && checkCol === randomCol) {
              isNearFirstClick = true;
              break;
            }
          }
          if (isNearFirstClick) break;
        }
        if (isNearFirstClick) continue;
      }
      
      if (!newBoard[randomRow][randomCol].isMine) {
        newBoard[randomRow][randomCol].isMine = true;
        minesPlaced++;
      }
    }

    // 计算每个格子周围的地雷数量
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;
              if (
                newRow >= 0 && 
                newRow < BOARD_SIZE && 
                newCol >= 0 && 
                newCol < BOARD_SIZE &&
                newBoard[newRow][newCol].isMine
              ) {
                count++;
              }
            }
          }
          newBoard[row][col].adjacentMines = count;
        }
      }
    }

    setBoard(newBoard);
    setGameStatus('playing');
    setFlagsCount(0);
    setFirstClick(firstClickRow === -1); // 如果是重新开始，重置firstClick
  };

  // 揭示格子
  const revealCell = (row, col) => {
    if (gameStatus !== 'playing' || board[row]?.[col]?.isRevealed || board[row]?.[col]?.isFlagged) {
      return;
    }

    // 第一次点击时初始化游戏板，确保安全
    if (firstClick) {
      initializeBoard(row, col);
      setFirstClick(false);
      return;
    }

    const newBoard = [...board.map(row => [...row])];
    newBoard[row][col].isRevealed = true;

    if (newBoard[row][col].isMine) {
      // 踩到地雷，游戏结束
      setGameStatus('lost');
      // 显示所有地雷
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          if (newBoard[r][c].isMine) {
            newBoard[r][c].isRevealed = true;
          }
        }
      }
    } else if (newBoard[row][col].adjacentMines === 0) {
      // 如果周围没有地雷，自动揭示相邻的格子
      revealAdjacentCells(newBoard, row, col);
    }

    setBoard(newBoard);
    checkWinCondition(newBoard);
  };

  // 双击已揭示的数字格子，自动展开周围未标记的格子
  const revealSurroundingCells = (row, col) => {
    if (gameStatus !== 'playing' || !board[row]?.[col]?.isRevealed || board[row][col].adjacentMines === 0) {
      return;
    }

    const newBoard = [...board.map(row => [...row])];
    
    // 计算周围已标记旗帜的数量
    let flaggedCount = 0;
    let unrevealedCells = [];
    
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i;
        const newCol = col + j;
        if (
          newRow >= 0 && 
          newRow < BOARD_SIZE && 
          newCol >= 0 && 
          newCol < BOARD_SIZE &&
          !(i === 0 && j === 0)
        ) {
          if (newBoard[newRow][newCol].isFlagged) {
            flaggedCount++;
          } else if (!newBoard[newRow][newCol].isRevealed) {
            unrevealedCells.push({ row: newRow, col: newCol });
          }
        }
      }
    }

    // 如果旗帜数量等于数字，则展开所有未标记的格子
    if (flaggedCount === newBoard[row][col].adjacentMines && unrevealedCells.length > 0) {
      let hitMine = false;
      
      unrevealedCells.forEach(cell => {
        const { row: r, col: c } = cell;
        newBoard[r][c].isRevealed = true;
        
        if (newBoard[r][c].isMine) {
          hitMine = true;
        } else if (newBoard[r][c].adjacentMines === 0) {
          // 如果展开的是空白格子，继续递归展开
          revealAdjacentCells(newBoard, r, c);
        }
      });

      if (hitMine) {
        setGameStatus('lost');
        // 显示所有地雷
        for (let r = 0; r < BOARD_SIZE; r++) {
          for (let c = 0; c < BOARD_SIZE; c++) {
            if (newBoard[r][c].isMine) {
              newBoard[r][c].isRevealed = true;
            }
          }
        }
      }
      
      setBoard(newBoard);
      checkWinCondition(newBoard);
    }
  };

  // 递归揭示相邻格子
  const revealAdjacentCells = (board, row, col) => {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i;
        const newCol = col + j;
        if (
          newRow >= 0 && 
          newRow < BOARD_SIZE && 
          newCol >= 0 && 
          newCol < BOARD_SIZE &&
          !board[newRow][newCol].isRevealed &&
          !board[newRow][newCol].isFlagged
        ) {
          board[newRow][newCol].isRevealed = true;
          if (board[newRow][newCol].adjacentMines === 0) {
            revealAdjacentCells(board, newRow, newCol);
          }
        }
      }
    }
  };

  // 检查胜利条件
  const checkWinCondition = (currentBoard) => {
    let unrevealedSafeCells = 0;
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (!currentBoard[row][col].isRevealed && !currentBoard[row][col].isMine) {
          unrevealedSafeCells++;
        }
      }
    }
    if (unrevealedSafeCells === 0) {
      setGameStatus('won');
    }
  };

  // 切换旗帜
  const toggleFlag = (row, col, e) => {
    e.preventDefault(); // 防止右键菜单
    if (gameStatus !== 'playing' || board[row]?.[col]?.isRevealed || firstClick) {
      return;
    }

    const newBoard = [...board.map(row => [...row])];
    const cell = newBoard[row][col];
    
    if (cell.isFlagged) {
      cell.isFlagged = false;
      setFlagsCount(prev => prev - 1);
    } else {
      cell.isFlagged = true;
      setFlagsCount(prev => prev + 1);
    }
    
    setBoard(newBoard);
  };

  // 改变难度
  const changeDifficulty = (level) => {
    setDifficulty(level);
    setFirstClick(true);
    // 重新初始化会自动使用新的难度设置
  };

  // 获取格子显示内容
  const getCellContent = (cell) => {
    if (cell.isFlagged) return '';
    if (!cell.isRevealed) return '';
    if (cell.isMine) return '💣';
    if (cell.adjacentMines > 0) return cell.adjacentMines;
    return '';
  };

  // 获取格子样式
  const getCellClass = (cell) => {
    let className = 'minesweeper-cell';
    if (cell.isRevealed) className += ' revealed';
    if (cell.isMine && cell.isRevealed) className += ' mine';
    if (cell.isFlagged) className += ' flagged';
    if (cell.isRevealed && cell.adjacentMines > 0) {
      className += ` adjacent-${cell.adjacentMines}`;
    }
    return className;
  };

  // 处理格子点击
  const handleCellClick = (row, col, e) => {
    e.preventDefault();
    if (board[row]?.[col]?.isRevealed) {
      // 如果是已揭示的数字格子，触发双击逻辑（这里通过单击已揭示格子来模拟或替代部分双击需求，或者作为辅助操作）
      // 注意：原参考方案中 onClick 触发了 revealSurroundingCells，这通常用于“点击已开数字自动展开”的功能。
      // 如果严格需要鼠标双击事件，应保留 onDoubleClick。但根据参考代码，它是用 onClick 判断状态来分发逻辑。
      // 这里我们按照参考方案，将点击已揭示格子的行为改为展开周围。
      revealSurroundingCells(row, col);
    } else {
      // 否则是普通点击
      revealCell(row, col);
    }
  };

  // 初始化游戏
  useEffect(() => {
    if (!firstClick) return;
    initializeBoard();
  }, [difficulty]);

  return (
    <div className="minesweeper-container">
      <div className="minesweeper-header">
        <h2 className="minesweeper-title">扫雷游戏</h2>
        
        <div className="minesweeper-difficulty">
          {Object.entries(DIFFICULTY_LEVELS).map(([key, level]) => (
            <button
              key={key}
              className={`difficulty-btn ${difficulty === key ? 'active' : ''}`}
              onClick={() => changeDifficulty(key)}
            >
              {level.name} ({level.size}×{level.mines})
            </button>
          ))}
        </div>

        <div className="minesweeper-info">
          {gameStatus === 'playing' && `剩余地雷: ${MINES_COUNT - flagsCount}`}
          {gameStatus === 'won' && <div className="game-status-message win-message">🎉 恭喜你赢了！</div>}
          {gameStatus === 'lost' && <div className="game-status-message lose-message">💥 游戏结束！</div>}
        </div>
      </div>
      
      <div 
        className="minesweeper-board" 
        style={{ 
          gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(25px, 35px))`,
          width: `${Math.min(BOARD_SIZE * 35 + 20, 500)}px`
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getCellClass(cell)}
              onClick={(e) => handleCellClick(rowIndex, colIndex, e)}
              onContextMenu={(e) => toggleFlag(rowIndex, colIndex, e)}
              style={{ 
                width: `${Math.max(25, 350 / BOARD_SIZE)}px`,
                height: `${Math.max(25, 350 / BOARD_SIZE)}px`
              }}
            >
              {getCellContent(cell)}
            </div>
          ))
        )}
      </div>
      
      <div className="minesweeper-controls">
        <button 
          className="restart-btn"
          onClick={() => {
            setFirstClick(true);
            initializeBoard();
          }}
        >
          {gameStatus === 'playing' ? '重新开始' : '新游戏'}
        </button>
      </div>
    </div>
  );
};

export default Minesweeper;