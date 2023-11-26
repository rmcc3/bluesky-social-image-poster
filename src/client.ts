import { BskyAgent } from '@atproto/api';
import { BskyImageApi } from './image-client';
import { BskyApiOptions } from './types';

export class BskyApi {
  public agent: BskyAgent;
  public images: BskyImageApi;

  constructor({ service, identifier, password }: BskyApiOptions) {
    this.agent = new BskyAgent({ service });
    this.images = new BskyImageApi({ client: this });
    this.agent.login({ identifier, password });
  }
}

export default BskyApi;
