const exprEl = document.getElementById('expr');
const resEl = document.getElementById('result');
const OPS = ['+', '−', '×', '÷'];
let expr = '';          // what the user has typed
let justEvaluated = false;

/* ---- parser: no eval(). expr -> term (+|-) term ; term -> factor (×|÷) factor ---- */
function evaluate(src) {
  const t = src.match(/\d*\.?\d+|\d+\.|[+−×÷%]/g) || [];
  let p = 0;
  const peek = () => t[p];
  function factor() {
    if (peek() === '−') { p++; return -factor(); }
    if (peek() === '+') { p++; return factor(); }
    const tok = t[p++];
    if (tok === undefined || isNaN(parseFloat(tok))) throw new Error('syntax');
    let v = parseFloat(tok);
    while (peek() === '%') { p++; v /= 100; }
    return v;
  }
  function term() {
    let v = factor();
    while (peek() === '×' || peek() === '÷') {
      const o = t[p++]; const r = factor();
      if (o === '÷' && r === 0) throw new Error('div0');
      v = o === '×' ? v * r : v / r;
    }
    return v;
  }
  function sum() {
    let v = term();
    while (peek() === '+' || peek() === '−') {
      const o = t[p++]; const r = term();
      v = o === '+' ? v + r : v - r;
    }
    return v;
  }
  const out = sum();
  if (p !== t.length) throw new Error('syntax');
  return out;
}

function fmt(n) {
  if (!isFinite(n)) throw new Error('syntax');
  const r = parseFloat(n.toPrecision(12));        // trims floating point noise (0.1+0.2)
  if (Math.abs(r) >= 1e15 || (r !== 0 && Math.abs(r) < 1e-9)) return r.toExponential(6).replace(/\.?0+e/, 'e');
  return r.toLocaleString('en-US', {maximumFractionDigits: 10, useGrouping: false});
}

function render(final) {
  exprEl.textContent = expr;
  resEl.classList.remove('err');
  if (!expr) { resEl.textContent = '0'; resEl.classList.remove('live'); return; }
  // live preview: ignore a dangling operator, e.g. "12+" previews as 12
  const cleaned = expr.replace(/[+−×÷]+$/, '');
  if (!cleaned) { resEl.textContent = '0'; return; }
  try {
    resEl.textContent = fmt(evaluate(cleaned));
    resEl.classList.toggle('live', !final);
  } catch (e) {
    if (e.message === 'div0') { resEl.textContent = 'Can’t divide by zero'; resEl.classList.add('err'); }
    else if (final) { resEl.textContent = 'Invalid expression'; resEl.classList.add('err'); }
  }
  exprEl.scrollLeft = exprEl.scrollWidth;
}

function lastNumber() { const m = expr.match(/[\d.]+$/); return m ? m[0] : ''; }

function press(k) {
  if (/^\d$/.test(k)) {
    if (justEvaluated) { expr = ''; justEvaluated = false; }
    if (/%$/.test(expr)) expr += '×';              // 5% then 2 -> 5%×2
    if (lastNumber() === '0') expr = expr.slice(0, -1);   // avoid leading zeros
    expr += k;
  } else if (k === '.') {
    if (justEvaluated) { expr = ''; justEvaluated = false; }
    if (lastNumber().includes('.')) return;
    expr += lastNumber() === '' ? '0.' : '.';
  } else if (OPS.includes(k)) {
    justEvaluated = false;
    if (!expr) { if (k === '−') expr = '−'; return render(); }
    if (expr === '−') return;
    if (OPS.includes(expr.slice(-1))) expr = expr.slice(0, -1); // replace operator
    expr += k;
  } else if (k === '%') {
    if (/[\d%]$/.test(expr)) { expr += '%'; justEvaluated = false; }
  } else if (k === 'AC') {
    expr = ''; justEvaluated = false;
  } else if (k === 'BS') {
    if (justEvaluated) { expr = ''; justEvaluated = false; } else expr = expr.slice(0, -1);
  } else if (k === '=') {
    if (!expr) return;
    const cleaned = expr.replace(/[+−×÷]+$/, '');
    try {
      const v = fmt(evaluate(cleaned));
      exprEl.textContent = cleaned + ' =';
      resEl.textContent = v; resEl.classList.remove('live', 'err');
      expr = v.replace('-', '−'); justEvaluated = true;   // keep calculating with the result
      return;
    } catch (e) {
      resEl.classList.add('err');
      resEl.textContent = e.message === 'div0' ? 'Can’t divide by zero' : 'Invalid expression';
      return;
    }
  }
  render(false);
}

document.getElementById('keys').addEventListener('click', e => {
  const b = e.target.closest('button'); if (b) press(b.dataset.k);
});

/* ---- keyboard support ---- */
const MAP = {'+':'+','-':'−','*':'×','x':'×','X':'×','/':'÷','Enter':'=','=':'=','Backspace':'BS','Escape':'AC','c':'AC','C':'AC','.':'.',',':'.','%':'%'};
document.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  const k = /^\d$/.test(e.key) ? e.key : MAP[e.key];
  if (!k) return;
  e.preventDefault();
  press(k);
  const btn = document.querySelector(`button[data-k="${k}"]`);
  if (btn) { btn.classList.add('press'); setTimeout(() => btn.classList.remove('press'), 110); }
});

render(false);
