import fs from 'fs/promises';
import path from 'path';
import { BskyAgent } from '@atproto/api';
import { ImagePost, ImagePostResponse } from './types';

async function checkAndReadFile(imagePath: string) {
  const fileExists = await fs
    .access(imagePath)
    .then(() => true)
    .catch(() => false);
  if (!fileExists) {
    throw new Error(`File does not exist: ${imagePath}`);
  }

  const fileExtension = path.extname(imagePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(fileExtension)) {
    throw new Error('Only JPG, JPEG, and PNG files are supported!');
  }

  return {
    imageBytes: await fs.readFile(imagePath),
    contentType: fileExtension === '.jpg' || fileExtension === '.jpeg' ? 'image/jpeg' : 'image/png',
  };
}

async function uploadImage(agent: BskyAgent, imagePath: string) {
  if (!agent || typeof agent.uploadBlob !== 'function') {
    throw new Error('Invalid BskyAgent instance.');
  }

  const { imageBytes, contentType } = await checkAndReadFile(imagePath);
  return agent.uploadBlob(imageBytes, { encoding: contentType });
}

export async function sendPostWithImages(
  agent: BskyAgent,
  imagePaths: string[],
  text = '',
): Promise<ImagePostResponse> {
  if (!Array.isArray(imagePaths) || imagePaths.length === 0) {
    throw new Error('Image paths must be an array with at least one image.');
  }

  const uploads = await Promise.all(imagePaths.map((image) => uploadImage(agent, image)));

  const post: ImagePost = {
    text,
    embed: {
      images: uploads.map((upload) => ({ image: upload.data.blob, alt: '' })),
      $type: 'app.bsky.embed.images',
    },
  };

  const response = await agent.post(post);

  return {
    ...post,
    response,
  };
}

export default sendPostWithImages;
