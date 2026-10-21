import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Modal } from 'antd';
import { LEVELS } from './levels.js';
import './index.css';

const REGION_COLORS = [
  '#FFE0E0', '#E0FFE0', '#E0E0FF', '#FFFFE0', '#FFE0FF',
  '#E0FFFF', '#FFE8D0', '#E8FFD0', '#D0E8FF', '#FFD0E8',
  '#D0FFE8', '#E8D0FF', '#FFF0D0', '#D0F0FF', '#F0D0FF',
];

const DIFFICULTY_COLOR = {
  '萌新': '#52c41a',
  '简单': '#73d13d',
  '中等': '#faad14',
  '困难': '#fa541c',
  '地狱': '#f5222d',
};

const Meowdoku2 = () => {
  const [levelIdx, setLevelIdx] = useState(0);
  const [board, setBoard] = useState(null);
  const [marks, setMarks] = useState(null);
  const [mistakeCells, setMistakeCells] = useState(null);
  const [lives, setLives] = useState(3);
  const [gameStatus, setGameStatus] = useState('playing');
  const [seconds, setSeconds] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const [showLevelSelect, setShowLevelSelect] = useState(false);

  const level = LEVELS[levelIdx];
  const N = level ? level.N : 9;

  const resetBoard = useCallback(() => {
    const n = LEVELS[levelIdx].N;
    setBoard(Array(n).fill(null).map(() => Array(n).fill(0)));
    setMarks(Array(n).fill(null).map(() => Array(n).fill(false)));
    setMistakeCells(Array(n).fill(null).map(() => Array(n).fill(false)));
    setLives(3);
    setGameStatus('playing');
    setSeconds(0);
    setShowHint(false);
  }, [levelIdx]);

  useEffect(() => { resetBoard(); }, [levelIdx, resetBoard]);

  useEffect(() => {
    if (gameStatus !== 'playing') return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [gameStatus]);

  const cellRegion = useMemo(() => {
    if (!level) return [];
    const n = level.N;
    const out = Array(n).fill(null).map(() => Array(n).fill(0));
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) out[r][c] = level.cellRegion[r * n + c];
    return out;
  }, [level]);

  const placedCount = useMemo(() => {
    if (!board) return 0;
    let c = 0;
    for (let r = 0; r < N; r++)
      for (let col = 0; col < N; col++)
        if (board[r][col]) c++;
    return c;
  }, [board, N]);

  const CELL_SIZE = useMemo(() => {
    if (N <= 7) return 52;
    if (N <= 9) return 45;
    if (N <= 10) return 40;
    return Math.floor(360 / N);
  }, [N]);

  const checkWin = (b) => {
    let allCorrect = true;
    for (let rr = 0; rr < N; rr++) {
      for (let cc = 0; cc < N; cc++) {
        if (level.solution[rr][cc] === 1) {
          if (b[rr][cc] !== 1) allCorrect = false;
        }
      }
    }
    if (allCorrect) setGameStatus('won');
  };

  const handleCellClick = (r, c) => {
    if (!board) return;
    if (gameStatus !== 'playing' && gameStatus !== 'lost') return;

    const v = board[r][c];
    const hasMark = marks[r][c];
    const isMistake = mistakeCells[r][c];

    if (v === 1 || isMistake) {
      const newBoard = board.map((row) => [...row]);
      const newMistake = mistakeCells.map((row) => [...row]);
      newBoard[r][c] = 0;
      newMistake[r][c] = false;
      setBoard(newBoard);
      setMistakeCells(newMistake);
      if (gameStatus === 'lost') setGameStatus('playing');
      checkWin(newBoard);
      return;
    }

    if (gameStatus !== 'playing') return;

    if (hasMark) {
      const newMarks = marks.map((row) => [...row]);
      newMarks[r][c] = false;
      const isCorrect = level.solution[r][c] === 1;
      const newBoard = board.map((row) => [...row]);
      const newMistake = mistakeCells.map((row) => [...row]);

      if (isCorrect) {
        newBoard[r][c] = 1;
        newMistake[r][c] = false;
        setBoard(newBoard);
        setMistakeCells(newMistake);
        setMarks(newMarks);
        checkWin(newBoard);
      } else {
        newMistake[r][c] = true;
        const newLives = lives - 1;
        setMistakeCells(newMistake);
        setMarks(newMarks);
        setLives(newLives);
        if (newLives <= 0) setGameStatus('lost');
      }
    } else {
      const newMarks = marks.map((row) => [...row]);
      newMarks[r][c] = true;
      setMarks(newMarks);
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (!board || !cellRegion.length || !level) return null;

  const boardPx = CELL_SIZE * N + (N - 1);

  return (
    <div className="m2-wrap">
      <div className="m2-header">
        <h2 className="m2-title">
          <span className="m2-title-icon">🐾</span> Meowdoku 喵窝放置
        </h2>

        <div className="m2-level-info">
          <span className="m2-level-num">第 {level.level} 关 · {N}×{N}</span>
          <span
            className="m2-level-diff"
            style={{ background: DIFFICULTY_COLOR[level.difficulty] }}
          >
            {level.difficulty}
          </span>
        </div>

        <div className="m2-info">
          <span>⏱ {formatTime(seconds)}</span>
          <span>🐱 {placedCount} / {N}</span>
          <span className="m2-lives">❤️ {lives}</span>
        </div>
      </div>

      <div
        className={`m2-board ${gameStatus === 'won' ? 'm2-board-won' : ''} ${gameStatus === 'lost' ? 'm2-board-lost' : ''}`}
        style={{
          gridTemplateColumns: `repeat(${N}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${N}, ${CELL_SIZE}px)`,
          width: boardPx,
          height: boardPx,
        }}
      >
        {board.map((row, ri) =>
          row.map((v, ci) => {
            const reg = cellRegion[ri][ci];
            const hasMark = marks[ri][ci];
            const isMistake = mistakeCells[ri][ci];
            const isHint = showHint && level.solution[ri][ci] === 1 && v === 0;
            const showCatContent = v === 1 && !isMistake;

            let content = '';
            if (showCatContent) content = '🐱';
            else if (isMistake) content = '✕';
            else if (hasMark) content = '✕';

            let cls = 'm2-cell';
            if (isMistake) cls += ' is-mistake';
            else if (hasMark && v === 0) cls += ' is-mark';
            if (isHint) cls += ' is-hint';
            if (showCatContent && gameStatus === 'won') cls += ' is-winning';

            return (
              <div
                key={`${ri}-${ci}`}
                className={cls}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  fontSize: Math.floor(CELL_SIZE * 0.55),
                  background: REGION_COLORS[reg % REGION_COLORS.length],
                  animationDelay: showCatContent && gameStatus === 'won'
                    ? `${(ri * N + ci) * 60}ms`
                    : undefined,
                }}
                onClick={() => handleCellClick(ri, ci)}
              >
                {content}
              </div>
            );
          })
        )}
      </div>

      <div className="m2-level-nav">
        <button
          className="m2-btn m2-btn-sm"
          disabled={levelIdx === 0}
          onClick={() => setLevelIdx((i) => Math.max(0, i - 1))}
        >
          ◀ 上一关
        </button>
        <button className="m2-btn m2-btn-sm" onClick={() => setShowLevelSelect(true)}>
          🎯 选关
        </button>
        <button
          className="m2-btn m2-btn-sm"
          disabled={levelIdx === LEVELS.length - 1}
          onClick={() => setLevelIdx((i) => Math.min(LEVELS.length - 1, i + 1))}
        >
          下一关 ▶
        </button>
      </div>

      <div className="m2-actions">
        <button className="m2-btn" onClick={() => setShowHelp(true)}>
          📖 操作说明
        </button>
        <button className="m2-btn" onClick={() => setShowHint((s) => !s)} disabled={gameStatus !== 'playing'}>
          {showHint ? '🙈 隐藏提示' : '💡 偷看答案'}
        </button>
        <button className="m2-btn m2-btn-primary" onClick={resetBoard}>
          🔄 重来本关
        </button>
      </div>

      {gameStatus === 'won' && (
        <div className="m2-win">
          🎉 第 {level.level} 关通过！用时 {formatTime(seconds)}
          {levelIdx < LEVELS.length - 1 && (
            <button
              className="m2-btn m2-btn-primary"
              style={{ marginLeft: 12, padding: '6px 14px' }}
              onClick={() => setLevelIdx((i) => Math.min(LEVELS.length - 1, i + 1))}
            >
              下一关 ▶
            </button>
          )}
        </div>
      )}
      {gameStatus === 'lost' && (
        <div className="m2-lose">
          💔 机会用完啦！
          <button
            className="m2-btn m2-btn-primary"
            style={{ marginLeft: 12, padding: '6px 14px' }}
            onClick={resetBoard}
          >
            再试一次
          </button>
        </div>
      )}

      <Modal
        title={<span style={{ fontSize: 20 }}>🐾 选择关卡</span>}
        open={showLevelSelect}
        onCancel={() => setShowLevelSelect(false)}
        footer={null}
        width={520}
      >
        <div className="m2-level-grid">
          {LEVELS.map((lv, i) => {
            const active = i === levelIdx;
            return (
              <button
                key={lv.level}
                className={`m2-level-card ${active ? 'active' : ''}`}
                onClick={() => {
                  setLevelIdx(i);
                  setShowLevelSelect(false);
                }}
              >
                <div className="m2-level-card-num">{lv.level}</div>
                <div
                  className="m2-level-card-diff"
                  style={{ background: DIFFICULTY_COLOR[lv.difficulty] }}
                >
                  {lv.difficulty}
                </div>
                <div className="m2-level-card-hint">
                  {lv.N}×{lv.N} · {lv.frozenCount} 个起手
                </div>
              </button>
            );
          })}
        </div>
      </Modal>

      <Modal
        title={<span style={{ fontSize: 20 }}>🐾 Meowdoku 喵窝放置 · 操作说明</span>}
        open={showHelp}
        onCancel={() => setShowHelp(false)}
        footer={null}
        width={520}
      >
        <div className="m2-help">
          <h4>🎯 游戏目标</h4>
          <p>在网格里放上正好每格一只的猫，满足所有规则。</p>

          <h4>📜 四条规则</h4>
          <ul>
            <li>🐱 <b>每行</b> 正好 1 只猫</li>
            <li>🐱 <b>每列</b> 正好 1 只猫</li>
            <li>🐱 <b>每个彩色模块</b> 正好 1 只猫（模块不规则，有大有小）</li>
            <li>🚫 任何两只猫 <b>不能相邻</b>，包括对角线方向</li>
          </ul>

          <h4>👆 点击操作</h4>
          <ul>
            <li>空格子：<b>点 1 次</b> → 出现 <b>✕</b>（笔记标记，表示"这里不放猫"）</li>
            <li>已经有 ✕：<b>再点 1 次</b> → 自动判断，合法 → 🐱，不合法 → <b>红色 ✕</b> 并扣 1 心</li>
            <li>🐱 或 红色 ✕：<b>点 1 次</b> → 撤回</li>
          </ul>

          <h4>💔 机会</h4>
          <p>你一共 <b>3 次</b> 容错机会。红色 ✕ 扣 1 心，<b>3 次用完就输</b>。</p>

          <h4>💡 小贴士</h4>
          <p>
            起手先找 <b>只有一个格子的小模块</b>——那个格子必然要放猫。
            关卡编号越大，单格模块越少，越需要推理甚至猜测！
          </p>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button className="m2-btn m2-btn-primary" onClick={() => setShowHelp(false)}>
              开始游戏 🐾
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Meowdoku2;