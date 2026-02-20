import test from 'node:test';
import assert from 'node:assert/strict';
import { Encryption } from '../js/modules/encryption.js';

test('Encryption round-trip works across sessions with passphrase', async () => {
  const plaintext = 'markdown secret payload';
  const passphrase = 'correct-horse-battery-staple';

  const firstSession = new Encryption();
  await firstSession.setPassphrase(passphrase);
  const ciphertext = await firstSession.encrypt(plaintext);

  const sameSessionPlain = await firstSession.decrypt(ciphertext);
  assert.equal(sameSessionPlain, plaintext);

  firstSession.lock();
  await assert.rejects(() => firstSession.decrypt(ciphertext), /No decryption key available/);

  const secondSession = new Encryption();
  const restoredPlain = await secondSession.decrypt(ciphertext, passphrase);
  assert.equal(restoredPlain, plaintext);
});
