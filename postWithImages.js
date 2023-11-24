// postWithImages.js
const fs = require('fs').promises;
const path = require('path');

async function checkAndReadFile(imagePath) {
    const fileExists = await fs.access(imagePath).then(() => true).catch(() => false);
    if (!fileExists) {
        throw new Error(`File does not exist: ${imagePath}`);
    }

    const fileExtension = path.extname(imagePath).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(fileExtension)) {
        throw new Error('Only JPG, JPEG, and PNG files are supported!');
    }

    return {
        imageBytes: await fs.readFile(imagePath),
        contentType: (fileExtension === '.jpg' || fileExtension === '.jpeg') ? 'image/jpeg' : 'image/png'
    };
}

async function uploadImage(agent, image) {
    if (!agent || typeof agent.uploadBlob !== 'function') {
        throw new Error('Invalid BskyAgent instance.');
    }

    const { imageBytes, contentType } = await checkAndReadFile(image);
    return agent.uploadBlob(imageBytes, { encoding: contentType });
}

async function sendPostWithImages(agent, imagePaths, text = '') {
    if (!Array.isArray(imagePaths) || imagePaths.length === 0) {
        throw new Error('Image paths must be an array with at least one image.');
    }

    const uploads = await Promise.all(imagePaths.map(image => uploadImage(agent, image)));

    const post = {
        text: text,
        embed: {
            images: uploads.map(upload => ({ image: upload.data.blob, alt: "" })),
            $type: "app.bsky.embed.images",
        },
    };

    return agent.post(post);
}

module.exports = sendPostWithImages;