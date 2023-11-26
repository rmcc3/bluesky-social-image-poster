import { BlobRef } from '@atproto/api';
import { BskyApi } from './client';

export type BskyApiOptions = { service: string; identifier: string; password: string };

export type BskyImageApiOptions = { client: BskyApi };

export type ImagePost = {
  text: string;
  embed: {
    images: { image: BlobRef; alt: string }[];
    $type: string;
  };
};

export type ImagePostResponse = ImagePost & {
  response: {
    uri: string;
    cid: string;
  };
};
