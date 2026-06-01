import 'dotenv/config';
import { input, select } from '@inquirer/prompts';
import clipboard from 'clipboardy';
import fetchAddress from './osPlaces.js';

const postcode = process.argv[2] ?? (await input({ message: 'Postcode?' }));

const response = await fetchAddress(postcode);
const results = response.results;
const addresses = results.map(item => item.DPA.ADDRESS);

if (addresses.length === 0) {
  console.log('No Address found.');
  process.exit(1);
}

const chosen = await select({
  message: 'Choose an address',
  choices: addresses.map(addr => ({ name: addr, value: addr })),
});

await clipboard.write(chosen);

console.log('Selected:', chosen);
