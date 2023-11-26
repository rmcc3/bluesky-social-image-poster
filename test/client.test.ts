import { describe, expect } from '@jest/globals';
import { MockBskyAgent } from './mocks';

jest.mock('@atproto/api', () => ({
  BskyAgent: MockBskyAgent,
}));

jest.mock('fs/promises', () => ({
  access: jest.fn().mockImplementation(async (path) => {
    if (path === 'invalidImage.jpg') {
      throw new Error('mockError');
    }
  }),
  writeFile: jest.fn().mockResolvedValue(Buffer.from('mockImageData')),
  readFile: jest.fn().mockResolvedValue(Buffer.from('mockImageData')),
}));

import { BskyApi } from '../src/client';

describe('BskyApi', () => {
  let client: BskyApi;

  beforeEach(() => {
    client = new BskyApi({ service: 'https://mock.service', identifier: 'mockIdentifier', password: 'mockPassword' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a post with images', async () => {
    const imagePaths = ['image1.jpg', 'image2.png'];
    const text = 'Test Post';

    const result = await client.images.post(imagePaths, text);

    expect(result).toHaveProperty('text', text);
    expect(result.embed.images).toHaveLength(imagePaths.length);
    expect(result.embed.images[0]).toHaveProperty('image', 'mockBlobUri');
  });

  it('should throw an error when no images are provided', async () => {
    const imagePaths = [] as any[];

    await expect(client.images.post(imagePaths)).rejects.toThrow(
      'Image paths must be an array with at least one image.',
    );
  });

  it('should throw an error when an invalid image path is provided', async () => {
    const imagePaths = ['invalidImage.jpg'];

    await expect(client.images.post(imagePaths)).rejects.toThrow('File does not exist: invalidImage.jpg');
  });

  it('should throw an error when an invalid file extension is provided', async () => {
    const imagePaths = ['invalidImage.gif'];

    await expect(client.images.post(imagePaths)).rejects.toThrow('Only JPG, JPEG, and PNG files are supported!');
  });

  it('should throw an error when an invalid BskyAgent instance is provided', async () => {
    client.agent = {} as any;

    await expect(client.images.post(['image.jpg'])).rejects.toThrow('Invalid BskyAgent instance.');
  });

  it('should throw an error when authentication fails', async () => {
    client.agent.login = jest.fn().mockRejectedValue(new Error('mockAuthError'));

    await expect(client.images.post(['image.jpg'])).rejects.toThrow('Failed to authenticate: mockAuthError');
  });

  it('should throw an error when uploading an image fails', async () => {
    client.agent.uploadBlob = jest.fn().mockRejectedValue(new Error('mockBlobError'));

    await expect(client.images.post(['image.jpg'])).rejects.toThrow('Failed to upload image: mockBlobError');
  });

  it('should throw an error when posting fails', async () => {
    client.agent.post = jest.fn().mockRejectedValue(new Error('mockPostError'));

    await expect(client.images.post(['image.jpg'])).rejects.toThrow('Failed to create post: mockPostError');
  });

  it("should call the client's authenticate method when not authenticated", async () => {
    client.authenticate = jest.fn();

    await client.images.post(['image.jpg']);

    expect(client.authenticate).toHaveBeenCalled();
  });

  it('should only call agent login once when not authenticated', async () => {
    client.agent.login = jest.fn().mockResolvedValue({});

    await client.images.post(['image.jpg']);
    await client.images.post(['image.jpg']);

    expect(client.agent.login).toHaveBeenCalledTimes(1);
  });
});
