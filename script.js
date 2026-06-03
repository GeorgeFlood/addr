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

  ///create the element we'll add the street name to
  const addressDiv = document.createElement('div');
  addressDiv.className = 'address-div';
  result.append(addressDiv);
  const streetName = document.createElement('h3');
  addressDiv.append(streetName);
  const cityPostCode = document.createElement('h3');
  addressDiv.append(cityPostCode);
  let selectedAddress;

  /// create the UL element to append each address into
  const addressUL = document.createElement('ul');
  addressUL.className = 'address-ul';
  result.append(addressUL);

  addresses.forEach(address => {
    const splitAddress = address.split(',');

    streetName.textContent = splitAddress[1];
    cityPostCode.textContent = `${splitAddress[2]}, ${splitAddress[3]}`;

    const doorNumber = document.createElement('li');
    doorNumber.className = 'doorNumbers';
    doorNumber.textContent = address.split(',')[0];
    doorNumber.dataset.fullAddress = address;
    addressUL.append(doorNumber);
    result.style.opacity = 1;
    searchBar.style.borderRadius = '14px 14px 0 0';

    doorNumber.addEventListener('click', async e => {
      selectedAddress = e.target.dataset;
      result.textContent = selectedAddress.fullAddress;
      console.log(selectedAddress);
    });
  });
});

/* --- getting dynamic year for footer --- */
const year = new Date().getFullYear();
date.textContent = year;
