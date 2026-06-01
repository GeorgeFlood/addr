const typedText = document.getElementById('typed-text');
const phrases = ['Type the postcode', 'Find the address'];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function tick() {
  const current = phrases[phraseIndex];

  if (isDeleting) {
    typedText.textContent = current.slice(0, charIndex - 1);
    charIndex--;
  } else {
    typedText.textContent = current.slice(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? 40 : 80;

  if (!isDeleting && charIndex === current.length) {
    delay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = 400;
  }
  setTimeout(tick, delay);
}

tick();
