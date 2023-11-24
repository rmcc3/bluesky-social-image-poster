# Bluesky Social Image Posting Module

## Overview
This module provides a streamlined solution for posting images to Bluesky Social. It abstracts the complexities involved in interacting with the Bluesky Social API, offering a simple interface for image uploads and post creation.

## Features
- **Multiple Image Support**: Allows posting multiple images in a single post.
- **Flexible Text Posting**: Enables posts with or without accompanying text.
- **File Type Validation**: Supports JPG, JPEG, and PNG formats, ensuring robust handling of image files.
- **Error Handling**: Robust error handling for file existence, file types, and API interactions.
- **Modular Design**: Easily integrable into larger projects or standalone applications.

## Limitations
- **File Type Support**: Currently, the Bluesky Social API supports only JPG, JPEG, and PNG file formats. This limitation is reflected in the module's validation process.
- **API Dependencies**: The module's functionality is dependent on the stability and availability of the Bluesky Social API.

## Installation
Ensure that Node.js is installed on your system, then clone this repository and install the dependencies:

```bash
git clone https://github.com/rmcc3/bluesky-social-image-poster.git
cd bluesky-social-image-poster
npm install
```

## Usage
The module's functionality is encapsulated in `postWithImages.js`. Here's a guide to using it in your project:

### Setting up the BskyAgent
Set up and log in to the `BskyAgent` in your main file (e.g., `main.js`):

```javascript
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

    // Additional code...
}

main();
```

### Creating a Post with Images
Use the `sendPostWithImages` function to post images:

```javascript
// Example usage
try {
    const imagePaths = ['./path/to/image1.jpg', './path/to/image2.jpeg'];
    const text = 'Optional post text';
    await sendPostWithImages(agent, imagePaths, text);
    console.log('Post created!');
} catch (error) {
    console.error('Error:', error.message);
}
```

## Contributing
Contributions are welcome. Please adhere to the project's coding standards and include tests for new features or bug fixes.

## License
This project is provided under a custom license. Usage, copying, modification, merging, publication, distribution, sublicensing, and/or selling of the software are permitted provided that the following conditions are met:

1. Appropriate credit must be given to the original author, Ray McCann, for any use of the software, in any form or medium.
2. The origin of this software must not be misrepresented; you must not claim that you wrote the original software.
3. Altered source versions must be plainly marked as such and must not be misrepresented as being the original software.

See the [LICENSE](LICENSE.md) file for more details.
