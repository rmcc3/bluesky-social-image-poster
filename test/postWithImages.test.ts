import { BskyAgent } from '@atproto/api';
import { describe, expect } from '@jest/globals';
import { sendPostWithImages } from '../src/postWithImages';

jest.mock('fs/promises', () => ({
  access: jest.fn().mockResolvedValue(true),
  writeFile: jest.fn().mockResolvedValue(Buffer.from('mockImageData')),
  readFile: jest.fn().mockResolvedValue(Buffer.from('mockImageData')),
}));

class MockBskyAgent {
  async login() {}

  async uploadBlob() {
    return { data: { blob: 'mockBlobUri' } };
  }

  async post(data: any) {
    return data;
  }
}

describe('sendPostWithImages', () => {
  let agent: BskyAgent;

  beforeEach(() => {
    agent = new MockBskyAgent() as unknown as BskyAgent;

    jest.clearAllMocks();
  });

  it('should create a post with images', async () => {
    const imagePaths = ['image1.jpg', 'image2.png'];
    const text = 'Test Post';

    // Call the function
    const result = await sendPostWithImages(agent, imagePaths, text);

    // Assertions
    expect(result).toHaveProperty('text', text);
    expect(result.embed.images).toHaveLength(imagePaths.length);
    expect(result.embed.images[0]).toHaveProperty('image', 'mockBlobUri');
  });
});
