import { describe, expect, it } from 'vitest';
import {
  decryptDirectMessage,
  encryptDirectMessage,
  verifyDirectMessage,
} from './direct-messages.js';
import {
  exportPublicKeyJwk,
  generateIdentityKeyPair,
  generateMessageKeyPair,
} from './keys.js';
import type { OpenSocialNetworkIdentity } from '../types.js';

describe('direct messages', () => {
  it('encrypts, signs, verifies, and decrypts a private message', async () => {
    const senderSigningKeys = await generateIdentityKeyPair();
    const sender = await identity('ada@example.com', senderSigningKeys);
    const recipientMessageKeys = await generateMessageKeyPair();

    const message = await encryptDirectMessage(
      {
        id: 'message_1',
        sender: sender.identity.handle,
        recipient: 'ben@example.com',
        createdAt: '2026-06-04T08:00:00.000Z',
        content: 'This should stay private.',
      },
      senderSigningKeys.privateKey,
      recipientMessageKeys.publicKey,
    );

    expect(JSON.stringify(message)).not.toContain('This should stay private.');
    await expect(verifyDirectMessage(message, sender.identity)).resolves.toBe(true);
    await expect(
      decryptDirectMessage(message, recipientMessageKeys.privateKey, sender.identity),
    ).resolves.toBe('This should stay private.');
  });

  it('rejects tampered direct messages', async () => {
    const senderSigningKeys = await generateIdentityKeyPair();
    const sender = await identity('ada@example.com', senderSigningKeys);
    const recipientMessageKeys = await generateMessageKeyPair();

    const message = await encryptDirectMessage(
      {
        id: 'message_1',
        sender: sender.identity.handle,
        recipient: 'ben@example.com',
        createdAt: '2026-06-04T08:00:00.000Z',
        content: 'This should stay private.',
      },
      senderSigningKeys.privateKey,
      recipientMessageKeys.publicKey,
    );

    await expect(
      verifyDirectMessage({ ...message, recipient: 'mallory@example.com' }, sender.identity),
    ).resolves.toBe(false);
  });
});

async function identity(
  handle: string,
  signingKeys: CryptoKeyPair,
): Promise<{ identity: OpenSocialNetworkIdentity }> {
  return {
    identity: {
      protocol: 'open-social-network',
      version: '0.1',
      handle,
      name: handle,
      bio: '',
      website: '',
      publicKey: {
        alg: 'ES256',
        jwk: await exportPublicKeyJwk(signingKeys.publicKey),
      },
      endpoints: {
        profile: '/profile.json',
        feed: '/feed.json',
        actions: '/opensocial/actions/inbox/index.json',
        messages: '/opensocial/messages/inbox/index.json',
      },
    },
  };
}
