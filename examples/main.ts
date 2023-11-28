// main.ts
import 'dotenv/config';
import { BskyApi } from '../src/index';

const client = new BskyApi({
  service: 'https://bsky.social',
  identifier: process.env.IDENTIFIER,
  password: process.env.PASSWORD,
});

try {
  // Replace these paths with the actual paths to your images
  const imagePaths = ['./path/to/image1.jpg', './path/to/image2.jpeg', './path/to/image3.png'];

  const text = 'Here is a post with multiple images!'; // Post text (optional)

  await client.images.post(imagePaths, text);
  console.log('Post created!');
} catch (error) {
  console.error('Error:', error.message);
}
