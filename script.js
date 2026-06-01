const input = document.getElementById('postcode');
const findBtn = document.getElementById('find');
const hint = document.getElementById('hint');
const result = document.getElementById('result');

/* --- typewriter placeholder: teaches people what to type --- */
const samples = [
  'e.g. SW15 1AA',
  'e.g. EC1A 1BB',
  'e.g. M1 1AE',
  'e.g. B33 8TH',
];
let s = 0,
  c = 0,
  deleting = false,
  typingPaused = false;
function typeLoop() {
  if (document.activeElement === input || input.value) {
    input.placeholder = 'Enter a postcode';
    return setTimeout(typeLoop, 600);
  }
  const word = samples[s];
  input.placeholder = word.slice(0, c) + '|';
  if (!deleting && c < word.length) c++;
  else if (!deleting && c === word.length) {
    deleting = true;
    return setTimeout(typeLoop, 1400);
  } else if (deleting && c > 5)
    c--; // keep the "e.g. " prefix
  else {
    deleting = false;
    s = (s + 1) % samples.length;
  }
  setTimeout(typeLoop, deleting ? 45 : 90);
}
typeLoop();

/* --- uppercase + tidy spacing as they type --- */
input.addEventListener('input', () => {
  input.value = input.value.toUpperCase().replace(/\s+/g, ' ');
  clearState();
});

const UK_PC = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;

function clearState() {
  hint.textContent = '';
  hint.classList.remove('error');
  result.classList.remove('show');
}

function setError(msg) {
  hint.textContent = msg;
  hint.classList.add('error');
  result.classList.remove('show');
}

async function lookup() {
  const raw = input.value.trim();
  if (!raw) return setError('Enter a postcode to search.');
  if (!UK_PC.test(raw))
    return setError("That doesn't look like a valid UK postcode.");

  findBtn.disabled = true;
  hint.classList.remove('error');
  hint.textContent = 'Searching…';

  try {
    const data = await fetchAddress(raw);
    renderResult(raw, data);
    hint.textContent = '';
  } catch (err) {
    setError(err.message || 'Something went wrong. Try again.');
  } finally {
    findBtn.disabled = false;
  }
}

/* ===========================================================
   SWAP THIS for your real Express route, e.g.
     const res = await fetch(`/lookup/${encodeURIComponent(pc)}`);
     if (!res.ok) throw new Error('No address found for that postcode.');
     return res.json();
   The mock below just lets the page work standalone in preview.
=========================================================== */
async function fetchAddress(pc) {
  await new Promise(r => setTimeout(r, 450)); // fake latency
  const db = {
    'SW15 1AA': {
      line: 'Putney High Street, London',
      town: 'London',
      region: 'Greater London',
    },
    'EC1A 1BB': {
      line: "St Paul's, City of London",
      town: 'London',
      region: 'Greater London',
    },
  };
  const hit = db[pc.toUpperCase()];
  if (!hit) throw new Error('No address found for that postcode.');
  return hit;
}

function renderResult(pc, d) {
  result.innerHTML = `
    <p class="pc">${pc.toUpperCase()}</p>
    <p class="addr">${d.line}</p>
    <div class="meta">
      <div><span>Town</span><strong>${d.town}</strong></div>
      <div><span>Region</span><strong>${d.region}</strong></div>
    </div>`;
  result.classList.add('show');
}

findBtn.addEventListener('click', lookup);
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') lookup();
});
