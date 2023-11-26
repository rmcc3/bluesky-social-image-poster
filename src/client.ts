import { BskyAgent } from '@atproto/api';
import { BskyImageApi } from './image-client';
import { BskyApiOptions } from './types';

export class BskyApi {
  public agent: BskyAgent;
  public images: BskyImageApi;
  public authenticated = false;
  private identifier: string;
  private password: string;

  constructor({ service, identifier, password }: BskyApiOptions) {
    this.agent = new BskyAgent({ service });
    this.images = new BskyImageApi({ client: this });
    this.identifier = identifier;
    this.password = password;
  }

  public async login(): Promise<void> {
    if (!this.identifier || !this.password) {
      throw new Error('Identifier and password are required to authenticate.');
    }

    await this.agent
      .login({
        identifier: this.identifier,
        password: this.password,
      })
      .catch((error) => {
        throw new Error(`Failed to authenticate: ${error.message}`);
      });

    this.authenticated = true;
  }

  public async authenticate(): Promise<void> {
    if (!this.authenticated) {
      await this.login();
    }
  }
}

export default BskyApi;
