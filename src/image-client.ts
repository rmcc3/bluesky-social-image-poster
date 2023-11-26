import { ComAtprotoRepoUploadBlob } from '@atproto/api';
import { BskyApi } from './client';
import { BSKY_EMBED_IMAGES } from './constants';
import { BskyImageApiOptions, ImagePost, ImagePostResponse } from './types';
import { checkAndReadFile, validateImagePaths } from './util';

export class BskyImageApi {
  public client: BskyApi;

  constructor({ client }: BskyImageApiOptions) {
    this.client = client;
  }

  public async uploadImage(imagePath: string): Promise<ComAtprotoRepoUploadBlob.Response> {
    const { imageBytes, contentType } = await checkAndReadFile(imagePath);
    return this.client.agent.uploadBlob(imageBytes, { encoding: contentType }).catch((error) => {
      throw new Error(`Failed to upload image: ${error.message}`);
    });
  }

  public async uploadImages(imagePaths: string[]): Promise<ComAtprotoRepoUploadBlob.Response[]> {
    validateImagePaths(imagePaths);

    const uploads = await Promise.all(imagePaths.map((image) => this.uploadImage(image))).catch((error) => {
      throw new Error(`Failed to upload image: ${error.message}`);
    });

    return uploads;
  }

  public async post(imagePaths: string[], text = ''): Promise<ImagePostResponse> {
    if (!this.client.agent || typeof this.client.agent.uploadBlob !== 'function') {
      throw new Error('Invalid BskyAgent instance.');
    }

    await this.client.authenticate();

    const uploads = await this.uploadImages(imagePaths);

    const post: ImagePost = {
      text,
      embed: {
        images: uploads.map((upload) => ({ image: upload.data.blob, alt: '' })),
        $type: BSKY_EMBED_IMAGES,
      },
    };

    const response = await this.client.agent.post(post);

    return {
      ...post,
      response,
    };
  }
}
