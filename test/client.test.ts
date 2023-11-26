import { describe, expect } from '@jest/globals';
import { MockBskyAgent } from './mocks';

jest.mock('@atproto/api', () => ({
  BskyAgent: MockBskyAgent,
}));

jest.mock('fs/promises', () => ({
  access: jest.fn().mockResolvedValue(true),
  writeFile: jest.fn().mockResolvedValue(Buffer.from('mockImageData')),
  readFile: jest.fn().mockResolvedValue(Buffer.from('mockImageData')),
}));

import { BskyApi } from '../src/client';

describe('sendPostWithImages', () => {
  let client: BskyApi;

  beforeEach(() => {
    client = new BskyApi({ service: 'mockService', identifier: 'mockIdentifier', password: 'mockPassword' });

    jest.clearAllMocks();
  });

  it('should create a post with images', async () => {
    const imagePaths = ['image1.jpg', 'image2.png'];
    const text = 'Test Post';

    // Call the function
    const result = await client.images.post(imagePaths, text);

    // Assertions
    expect(result).toHaveProperty('text', text);
    expect(result.embed.images).toHaveLength(imagePaths.length);
    expect(result.embed.images[0]).toHaveProperty('image', 'mockBlobUri');
  });
});
