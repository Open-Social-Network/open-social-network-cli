import { webcrypto } from 'node:crypto';

const KEY_ALGORITHM: EcKeyGenParams = {
  name: 'ECDSA',
  namedCurve: 'P-256',
};

const MESSAGE_KEY_ALGORITHM: EcKeyGenParams = {
  name: 'ECDH',
  namedCurve: 'P-256',
};

export async function generateIdentityKeyPair(): Promise<CryptoKeyPair> {
  return (await webcrypto.subtle.generateKey(KEY_ALGORITHM, true, [
    'sign',
    'verify',
  ])) as unknown as CryptoKeyPair;
}

export async function generateMessageKeyPair(): Promise<CryptoKeyPair> {
  return (await webcrypto.subtle.generateKey(MESSAGE_KEY_ALGORITHM, true, [
    'deriveKey',
  ])) as unknown as CryptoKeyPair;
}

export async function exportPublicKeyJwk(publicKey: CryptoKey): Promise<JsonWebKey> {
  return webcrypto.subtle.exportKey('jwk', publicKey as unknown as webcrypto.CryptoKey);
}

export async function exportPrivateKeyJwk(privateKey: CryptoKey): Promise<JsonWebKey> {
  return webcrypto.subtle.exportKey('jwk', privateKey as unknown as webcrypto.CryptoKey);
}

export async function importPrivateKeyJwk(jwk: JsonWebKey): Promise<CryptoKey> {
  return (await webcrypto.subtle.importKey(
    'jwk',
    jwk,
    KEY_ALGORITHM,
    true,
    ['sign'],
  )) as unknown as CryptoKey;
}

export async function importPublicKeyJwk(jwk: JsonWebKey): Promise<CryptoKey> {
  return (await webcrypto.subtle.importKey(
    'jwk',
    jwk,
    KEY_ALGORITHM,
    true,
    ['verify'],
  )) as unknown as CryptoKey;
}

export function publicJwkFromPrivateJwk(privateJwk: JsonWebKey): JsonWebKey {
  const { kty, crv, x, y } = privateJwk;
  return {
    kty,
    crv,
    x,
    y,
    ext: true,
    key_ops: ['verify'],
  };
}

export function publicMessageJwkFromPrivateJwk(privateJwk: JsonWebKey): JsonWebKey {
  const { d: _d, key_ops: _keyOps, ...publicJwk } = privateJwk;

  return {
    ...publicJwk,
    kty: publicJwk.kty ?? 'EC',
    crv: publicJwk.crv ?? 'P-256',
    ext: true,
  };
}
