const input = document.getElementById('postcode');
const findBtn = document.getElementById('find');
const result = document.getElementById('result');
const date = document.getElementById('date');
const searchBar = document.getElementById('search');
const copySVG = './img/copy-link-icon.svg';

/* --- typewriter placeholder: teaches people what to type --- */
const samples = [
  'e.g. SW15 1AA',
  'e.g. EC1A 1BB',
  'e.g. M1 1AE',
  'e.g. B33 8TH',
];

/* ---variables global scope --- */
let selectedAddress;
const CopyBtn = document.createElement('button');

/* --- function global scope --- */

/* --- Clean selected address up --- */
const cleanAddress = address => {
  const addressSplit = address.fullAddress.split(',');

  const cleanedAddress = addressSplit.map(el => {
    return el.trim()[0].toUpperCase() + el.trim().slice(1).toLowerCase();
  });

  let houseNumber = cleanedAddress[0];
  let street = cleanedAddress[1];
  let city = cleanedAddress[2];
  const postCode = addressSplit[3].toUpperCase();

  const cleanedAddressString = `${houseNumber} ${street} <br>
   ${city} <br>
    ${postCode}`;
  return cleanedAddressString;
};
/* --- copy address to clipboard --- */
const copyAddress = async () => {
  try {
    await navigator.clipboard.writeText(selectedAddress.fullAddress);
  } catch (err) {
    console.log(err);
  }
};

/* --- type writer effect on search bar --- */
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
      console.log(selectedAddress);
      const selectedAddressDiv = document.createElement('div');
      selectedAddressDiv.className = 'selectedAddressDiv';
      result.textContent = '';
      result.append(selectedAddressDiv);
      const selectedAddressH2 = document.createElement('h2');
      selectedAddressH2.className = 'selectedAddress';
      selectedAddressH2.innerHTML = cleanAddress(selectedAddress);
      selectedAddressDiv.append(selectedAddressH2);

      CopyBtn.className = 'CopyBtn';
      CopyBtn.innerHTML = `
      <?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 111.07 122.88" style="enable-background:new 0 0 111.07 122.88" xml:space="preserve"><style type="text/css"><![CDATA[
	.st0{fill-rule:evenodd;clip-rule:evenodd;}
]]></style><g><path class="st0" d="M97.67,20.81L97.67,20.81l0.01,0.02c3.7,0.01,7.04,1.51,9.46,3.93c2.4,2.41,3.9,5.74,3.9,9.42h0.02v0.02v75.28 v0.01h-0.02c-0.01,3.68-1.51,7.03-3.93,9.46c-2.41,2.4-5.74,3.9-9.42,3.9v0.02h-0.02H38.48h-0.01v-0.02 c-3.69-0.01-7.04-1.5-9.46-3.93c-2.4-2.41-3.9-5.74-3.91-9.42H25.1c0-25.96,0-49.34,0-75.3v-0.01h0.02 c0.01-3.69,1.52-7.04,3.94-9.46c2.41-2.4,5.73-3.9,9.42-3.91v-0.02h0.02C58.22,20.81,77.95,20.81,97.67,20.81L97.67,20.81z M0.02,75.38L0,13.39v-0.01h0.02c0.01-3.69,1.52-7.04,3.93-9.46c2.41-2.4,5.74-3.9,9.42-3.91V0h0.02h59.19 c7.69,0,8.9,9.96,0.01,10.16H13.4h-0.02v-0.02c-0.88,0-1.68,0.37-2.27,0.97c-0.59,0.58-0.96,1.4-0.96,2.27h0.02v0.01v3.17 c0,19.61,0,39.21,0,58.81C10.17,83.63,0.02,84.09,0.02,75.38L0.02,75.38z M100.91,109.49V34.2v-0.02h0.02 c0-0.87-0.37-1.68-0.97-2.27c-0.59-0.58-1.4-0.96-2.28-0.96v0.02h-0.01H38.48h-0.02v-0.02c-0.88,0-1.68,0.38-2.27,0.97 c-0.59,0.58-0.96,1.4-0.96,2.27h0.02v0.01v75.28v0.02h-0.02c0,0.88,0.38,1.68,0.97,2.27c0.59,0.59,1.4,0.96,2.27,0.96v-0.02h0.01 h59.19h0.02v0.02c0.87,0,1.68-0.38,2.27-0.97c0.59-0.58,0.96-1.4,0.96-2.27L100.91,109.49L100.91,109.49L100.91,109.49 L100.91,109.49z"/></g></svg>
      <span>Copy</span>`;
      selectedAddressDiv.append(CopyBtn);
    });
  });
});

CopyBtn.addEventListener('click', () => {
  copyAddress();
  CopyBtn.innerHTML = 'Copied!';
});

/* --- getting dynamic year for footer --- */
const year = new Date().getFullYear();
date.textContent = year;
