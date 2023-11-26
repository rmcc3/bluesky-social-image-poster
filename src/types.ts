import { BlobRef } from '@atproto/api';

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
