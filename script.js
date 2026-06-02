const input = document.getElementById('postcode');
const findBtn = document.getElementById('find');
const result = document.getElementById('result');
const date = document.getElementById('date');

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
});

findBtn.addEventListener('click', () => {
  const postcode = input.value.trim();
  input.value = '';

  if (!postcode) result.textContent = 'Enter a postcode';
});

/* --- getting dynamic year for footer --- */
const year = new Date().getFullYear();
date.textContent = year;
