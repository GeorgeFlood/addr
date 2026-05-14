// if (process.argv[2] === '--address') {
//   console.log('return something');
//   process.exit();
// } else if (process.argv[2] !== '--address') {
//   console.log('computer says no');
//   process.exit();
// }

const API_KEY = process.env.OS_DATA_API_Key;

const fetchAddress = async postcode => {
  const response = await fetch(
    `https://api.os.uk/search/places/v1/${postcode}?key=${API_KEY}`,
  );

  if (!response.ok) {
    throw new Error(`Issue with API!: ${response.status}`);
  }

  return response.json();
};

export default fetchAddress;
