import { BskyAgent } from '@atproto/api';
import { ImagePost, ImagePostResponse } from './types';
import { checkAndReadFile, validateImagePaths } from './util';
import { BSKY_EMBED_IMAGES } from './constants';

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
  validateImagePaths(imagePaths);

  const uploads = await Promise.all(imagePaths.map((image) => uploadImage(agent, image))).catch((error) => {
    throw new Error(`Failed to upload image: ${error.message}`);
  });

  const post: ImagePost = {
    text,
    embed: {
      images: uploads.map((upload) => ({ image: upload.data.blob, alt: '' })),
      $type: BSKY_EMBED_IMAGES,
    },
  };

  const response = await agent.post(post);

  return {
    ...post,
    response,
  };
}

export default sendPostWithImages;
