// Basic test for Storage module
import { Storage } from './modules/storage.js';

describe('Storage', () => {
  let storage;

  beforeAll(async () => {
    storage = new Storage();
    await storage.ready();
  });

  it('should save and retrieve a document', async () => {
    const doc = { title: 'Test', content: 'Hello', id: 'test-id' };
    await storage.saveDocument(doc);
    const loaded = await storage.getDocument('test-id');
    expect(loaded.title).toBe('Test');
    expect(loaded.content).toBe('Hello');
  });

  it('should reject invalid document', async () => {
    await expect(storage.saveDocument(null)).rejects.toThrow();
  });
});
