import { webcrypto } from 'node:crypto';
import { bytesToBase64Url, base64UrlToBytes } from './base64url.js';
import { canonicalStringify, postSigningPayload } from './canonical.js';
import { importPrivateKeyJwk, importPublicKeyJwk } from './keys.js';
import type { OpenSocialNetworkIdentity, OpenSocialNetworkPost, UnsignedOpenSocialNetworkPost } from '../types.js';

const SIGNING_ALGORITHM: EcdsaParams = {
  name: 'ECDSA',
  hash: 'SHA-256',
};

export async function signPost(
  post: UnsignedOpenSocialNetworkPost,
  privateJwk: JsonWebKey,
): Promise<OpenSocialNetworkPost> {
  const privateKey = await importPrivateKeyJwk(privateJwk);
  const payload = new TextEncoder().encode(canonicalStringify(postSigningPayload(post)));
  const signature = await webcrypto.subtle.sign(SIGNING_ALGORITHM, privateKey, payload);

  return {
    ...post,
    signature: {
      alg: 'ES256',
      value: bytesToBase64Url(signature),
    },
  };
}

export async function verifyPost(
  post: OpenSocialNetworkPost,
  identity: OpenSocialNetworkIdentity,
): Promise<boolean> {
  if (post.author !== identity.handle || post.signature?.alg !== 'ES256') {
    return false;
  }

  try {
    const publicKey = await importPublicKeyJwk(identity.publicKey.jwk);
    const payload = new TextEncoder().encode(canonicalStringify(postSigningPayload(post)));

    return webcrypto.subtle.verify(
      SIGNING_ALGORITHM,
      publicKey,
      base64UrlToBytes(post.signature.value),
      payload,
    );
  } catch {
    return false;
  }
}
