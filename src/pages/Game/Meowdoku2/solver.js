function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildNeighbors(N) {
  const n = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const s = new Set();
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < N && nc >= 0 && nc < N) s.add(nr * N + nc);
        }
      }
      n.push(s);
    }
  }
  return n;
}

function findCats(N, allNb) {
  const size = N * N;
  const result = Array(size).fill(0);
  const colUsed = new Set();

  function bt(row) {
    if (row === N) return true;
    const cands = [];
    for (let c = 0; c < N; c++) {
      if (colUsed.has(c)) continue;
      const idx = row * N + c;
      let adj = false;
      for (const n of allNb[idx]) if (result[n]) { adj = true; break; }
      if (adj) continue;
      cands.push(c);
    }
    const shuffled = shuffle(cands);
    for (const c of shuffled) {
      colUsed.add(c);
      result[row * N + c] = 1;
      if (bt(row + 1)) return true;
      colUsed.delete(c);
      result[row * N + c] = 0;
    }
    return false;
  }

  return bt(0) ? result : null;
}

function growRegions(N, catPositions, frozenCount = 0) {
  const size = N * N;
  const cellRegion = new Array(size).fill(-1);
  catPositions.forEach((idx, i) => { cellRegion[idx] = i; });

  const totalCells = size - catPositions.length;
  const frozen = new Set();
  const seedCount = catPositions.length;
  const freezeN = Math.min(frozenCount, seedCount);
  const pick = shuffle([...Array(seedCount).keys()]).slice(0, freezeN);
  pick.forEach((r) => frozen.add(r));

  function neighbors4(idx) {
    const r = Math.floor(idx / N), c = idx % N;
    const out = [];
    [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) => {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < N && nc >= 0 && nc < N) out.push(nr * N + nc);
    });
    return out;
  }

  let remaining = totalCells;
  let guard = 0;
  while (remaining > 0 && guard++ < 10000) {
    const frontier = [];
    for (let idx = 0; idx < size; idx++) {
      if (cellRegion[idx] !== -1) continue;
      const regs = new Set();
      for (const n of neighbors4(idx)) {
        if (cellRegion[n] !== -1 && !frozen.has(cellRegion[n])) {
          regs.add(cellRegion[n]);
        }
      }
      if (regs.size > 0) frontier.push({ idx, regs: [...regs] });
    }
    if (frontier.length === 0) {
      for (let idx = 0; idx < size; idx++) {
        if (cellRegion[idx] !== -1) continue;
        const regs = new Set();
        for (const n of neighbors4(idx)) if (cellRegion[n] !== -1) regs.add(cellRegion[n]);
        if (regs.size > 0) frontier.push({ idx, regs: [...regs] });
      }
      if (frontier.length === 0) break;
    }
    const pickF = frontier[Math.floor(Math.random() * frontier.length)];
    const reg = pickF.regs[Math.floor(Math.random() * pickF.regs.length)];
    cellRegion[pickF.idx] = reg;
    remaining--;
  }
  return cellRegion;
}

export function generatePuzzle(N = 9, frozenCount = 2) {
  const allNb = buildNeighbors(N);
  const catArr = findCats(N, allNb);
  if (!catArr) return null;

  const catPositions = [];
  for (let idx = 0; idx < N * N; idx++) if (catArr[idx]) catPositions.push(idx);

  const cellRegion = growRegions(N, catPositions, frozenCount);

  const solution = Array(N).fill(null).map(() => Array(N).fill(0));
  for (let idx = 0; idx < N * N; idx++) {
    if (catArr[idx]) solution[Math.floor(idx / N)][idx % N] = 1;
  }

  return { cellRegion, solution };
}

export function generateLevelData(N, frozenCount) {
  for (let attempt = 0; attempt < 100; attempt++) {
    const p = generatePuzzle(N, frozenCount);
    if (p) return p;
  }
  return null;
}