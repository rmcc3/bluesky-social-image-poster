export class MockBskyAgent {
  async login() {}

  async uploadBlob() {
    return { data: { blob: 'mockBlobUri' } };
  }

  async post<T>(data: T): Promise<T> {
    return Promise.resolve(data);
  }
}
