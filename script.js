const input = document.getElementById('postcode');
const findBtn = document.getElementById('find');
const result = document.getElementById('result');
const date = document.getElementById('date');
const searchBar = document.getElementById('search');

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
input.addEventListener('input', async () => {
  input.value = input.value.toUpperCase().replace(/\s+/g, ' ');
});

/* --- find button click + creating elements to display on page.. react would of been nice. */
findBtn.addEventListener('click', async () => {
  result.textContent = '';
  const postcode = input.value.trim();
  if (!postcode) {
    result.textContent = 'Enter a postcode';
    return;
  }
  const url = `/v1/address/?postcode=${encodeURIComponent(postcode)}`;
  const res = await fetch(url);
  const data = await res.json();
  const addresses = data.data.addresses;

  const addressUL = document.createElement('ul');
  addressUL.className = 'address-ul';
  result.append(addressUL);

  addresses.forEach(address => {
    const addressLI = document.createElement('li');
    addressLI.className = 'address-li';

    addressLI.textContent = address;
    addressUL.append(addressLI);
    result.style.opacity = 1;
    searchBar.style.borderRadius = '14px 14px 0 0';
  });
});

/* --- getting dynamic year for footer --- */
const year = new Date().getFullYear();
date.textContent = year;
