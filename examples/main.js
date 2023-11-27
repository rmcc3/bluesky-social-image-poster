// main.js
require('dotenv').config();
const { BskyAgent } = require('@atproto/api');
const sendPostWithImages = require('./postWithImages');

async function main() {
    const agent = new BskyAgent({ service: 'https://bsky.social' });

    await agent.login({
        identifier: process.env.IDENTIFIER,
        password: process.env.PASSWORD,
    });

    try {
        // Replace these paths with the actual paths to your images
        const imagePaths = [
            './path/to/image1.jpg',
            './path/to/image2.jpeg',
            './path/to/image3.png'
        ];

        const text = 'Here is a post with multiple images!'; // Post text (optional)

        await sendPostWithImages(agent, imagePaths, text);
        console.log('Post created!');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
