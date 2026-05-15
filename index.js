// if (process.argv[2] === '--address') {
//   console.log('return something');
//   process.exit();
// } else if (process.argv[2] !== '--address') {
//   console.log('computer says no');
//   process.exit();
// }

const API_KEY = process.env.OS_DATA_API_Key;
console.log(`API: ${API_KEY}`);
const fetchAddress = async postcode => {
  const cleaned = postcode.replace(/\s+/g, '');

  const response = await fetch(
    `https://api.os.uk/search/places/v1/postcode?postcode=${cleaned}&key=${API_KEY}`,
  );

  if (!response.ok) {
    throw new Error(`Issue with API!: ${response.status}`);
  }

  return response.json();
};

export default fetchAddress;
