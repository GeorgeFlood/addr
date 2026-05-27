const API_KEY = process.env.OS_DATA_API_Key;

const fetchAddress = async postcode => {
  const cleaned = postcode.replace(/\s+/g, '');

  const response = await fetch(
    `https://api.os.uk/search/places/v1/postcode?postcode=${postcode}&key=${API_KEY}`,
  );

  if (!response.ok) {
    throw new Error(`Issue with API!: ${response.status}`);
  }

  return response.json();
};

export default fetchAddress;
