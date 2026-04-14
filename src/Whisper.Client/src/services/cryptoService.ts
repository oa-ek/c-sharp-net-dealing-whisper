import { ed25519, x25519 } from '@noble/curves/ed25519.js';
import { base64 } from '@scure/base';
import type { KeyPair, SignedKeyPair } from '../types/db';

export const CryptoService = {
    toB64: (bytes: Uint8Array) => base64.encode(bytes),
    fromB64: (str: string) => base64.decode(str),

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

    calculateDH(privateKeyB64: string, publicKeyB64: string): Uint8Array<ArrayBuffer> {
    const result = x25519.getSharedSecret(this.fromB64(privateKeyB64), this.fromB64(publicKeyB64));
        return new Uint8Array(result.buffer.slice(result.byteOffset, result.byteOffset + result.byteLength));
    },
    async deriveMasterKey(dhResults: Uint8Array[]): Promise<Uint8Array<ArrayBuffer>> {
    const totalLength = dhResults.reduce((acc, val) => acc + val.length, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const res of dhResults) {
        combined.set(res, offset);
        offset += res.length;
    }
    const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
    return new Uint8Array(hashBuffer);
    },
};