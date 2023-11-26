import { BskyApi } from './client';
import sendPostWithImages from './postWithImages';
import { BskyImageApiOptions, ImagePostResponse } from './types';

export class BskyImageApi {
  public client: BskyApi;

  constructor({ client }: BskyImageApiOptions) {
    this.client = client;
  }

  public async post(imagePaths: string[], text = ''): Promise<ImagePostResponse> {
    return sendPostWithImages(this.client.agent, imagePaths, text);
  }
}
