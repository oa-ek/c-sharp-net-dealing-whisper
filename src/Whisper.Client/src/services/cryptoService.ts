import { ed25519, x25519 } from '@noble/curves/ed25519.js';
import { base64 } from '@scure/base';
import type { KeyPair, SignedKeyPair } from '../types/db';

const P = (1n << 255n) - 19n;

export const CryptoService = {
  toB64: (bytes: Uint8Array) => base64.encode(bytes),
  fromB64: (str: string) => base64.decode(str),


  modPow(base: bigint, exp: bigint, mod: bigint): bigint {
    let res = 1n;
    base = base % mod;
    while (exp > 0n) {
      if (exp % 2n === 1n) res = (res * base) % mod;
      base = (base * base) % mod;
      exp = exp / 2n;
    }
    return res;
  },

  async edPrivToX(privEdB64: string): Promise<string> {
    const privEd = this.fromB64(privEdB64);
    const hashBuffer = await crypto.subtle.digest('SHA-512', privEd as any);
    const hashArray = new Uint8Array(hashBuffer);
    const privX = hashArray.slice(0, 32);
    privX[0] &= 248;
    privX[31] &= 127;
    privX[31] |= 64;
    return this.toB64(privX);
  },

  edPubToX(pubEdB64: string): string {
    const bytes = this.fromB64(pubEdB64);
    let y = 0n;
    for (let i = 0; i < 32; i++) {
      y = y | (BigInt(bytes[i]) << (8n * BigInt(i)));
    }
    y &= (1n << 255n) - 1n; 
    const one = 1n;
    const num = (one + y) % P;
    const den = (one - y + P) % P;
    const invDen = this.modPow(den, P - 2n, P);
    const u = (num * invDen) % P;
    const uBytes = new Uint8Array(32);
    let tempU = u;
    for (let i = 0; i < 32; i++) {
      uBytes[i] = Number(tempU & 0xffn);
      tempU >>= 8n;
    }
    return this.toB64(uBytes);
  },


  async encryptAES(plainText: string, keyB64: string): Promise<string> {
    const keyData = this.fromB64(keyB64);
    const iv = crypto.getRandomValues(new Uint8Array(12)); 
    const encoder = new TextEncoder();
    const data = encoder.encode(plainText);

    const cryptoKey = await crypto.subtle.importKey(
      'raw', keyData as any, { name: 'AES-GCM' }, false, ['encrypt']
    );

    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, data);

    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return this.toB64(combined);
  },

  async decryptAES(combinedB64: string, keyB64: string): Promise<string> {
    const combined = this.fromB64(combinedB64);
    const keyData = this.fromB64(keyB64);
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const cryptoKey = await crypto.subtle.importKey(
      'raw', keyData as any, { name: 'AES-GCM' }, false, ['decrypt']
    );

    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, data);
    return new TextDecoder().decode(decrypted);
  },

  generateRandomKeyB64(): string {
    return this.toB64(crypto.getRandomValues(new Uint8Array(32)));
  },


  generateIdentityKeys(): KeyPair {
    const priv = ed25519.utils.randomSecretKey();
    const pub = ed25519.getPublicKey(priv);
    return { privateKey: this.toB64(priv), publicKey: this.toB64(pub) };
  },

  generateSignedPreKey(identityPrivB64: string): SignedKeyPair {
    const priv = x25519.utils.randomSecretKey();
    const pub = x25519.getPublicKey(priv);
    const signature = ed25519.sign(pub, this.fromB64(identityPrivB64));
    return {
      privateKey: this.toB64(priv),
      publicKey: this.toB64(pub),
      signature: this.toB64(signature),
    };
  },

  generateOneTimePreKeys(count: number): KeyPair[] {
    return Array.from({ length: count }, () => {
      const priv = x25519.utils.randomSecretKey();
      const pub = x25519.getPublicKey(priv);
      return { privateKey: this.toB64(priv), publicKey: this.toB64(pub) };
    });
  },

  calculateDH(privateKeyB64: string, publicKeyB64: string): any {
    const result = x25519.getSharedSecret(this.fromB64(privateKeyB64), this.fromB64(publicKeyB64));
    return new Uint8Array(result);
  },

  async deriveMasterKey(dhResults: any[]): Promise<any> {
    const totalLength = dhResults.reduce((acc, val) => acc + val.length, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const res of dhResults) {
      combined.set(res, offset);
      offset += res.length;
    }
    const hashBuffer = await crypto.subtle.digest('SHA-256', combined as any);
    return new Uint8Array(hashBuffer);
  },
};