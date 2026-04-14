import { CryptoService } from "./cryptoService";
import agent from "../api/agent";
import { db } from "../api/db";
import type { ChatSession } from "../types/db";

const INIT_TAG = "#InitCode";
const END_TAG = "-#InitCode";

const debugDH = (name: string, value: Uint8Array) => {
  console.log(`[DH Debug] ${name}:`, CryptoService.toB64(value).slice(0, 10) + "...");
};

export const EncryptionService = {
  async encryptMessage(plainText: string, sharedKeyB64: string) {
    const wrapKey = CryptoService.generateRandomKeyB64();
    const ciphertext = await CryptoService.encryptAES(plainText, wrapKey);
    const wrappedKey = await CryptoService.encryptAES(wrapKey, sharedKeyB64);

    return { ciphertext, wrappedKey };
  },

  async decryptMessage(ciphertext: string, wrappedKey: string, sharedKeyB64: string): Promise<string> {
    try {
      const wrapKey = await CryptoService.decryptAES(wrappedKey, sharedKeyB64);
      return await CryptoService.decryptAES(ciphertext, wrapKey);
    } catch (e) {
      console.error("❌ Decryption error:", e);
      return "🔒 Помилка дешифрування";
    }
  },

  async initializeChat(serverChatId: string, recipientId: string, recipientDeviceId: string) {
    try {
      const bundle = await agent.Keys.getBundle(recipientDeviceId);
      const myAuth = await db.auth.toCollection().first();
      if (!myAuth) throw new Error("Сесія не ініціалізована");

      const ephemeral = CryptoService.generateOneTimePreKeys(1)[0];
      const aliceIdentityPrivX = await CryptoService.edPrivToX(myAuth.identity.privateKey);
      const bobIdentityPubX = CryptoService.edPubToX(bundle.publicIdentityKey);

      const dh1 = CryptoService.calculateDH(aliceIdentityPrivX, bundle.signedPreKey);
      const dh2 = CryptoService.calculateDH(ephemeral.privateKey, bobIdentityPubX);
      const dh3 = CryptoService.calculateDH(ephemeral.privateKey, bundle.signedPreKey);
      const dh4 = bundle.oneTimePreKey 
        ? CryptoService.calculateDH(ephemeral.privateKey, bundle.oneTimePreKey)
        : new Uint8Array(32).fill(0);

      debugDH("DH1", dh1);
      debugDH("DH2", dh2);
      debugDH("DH3", dh3);
      debugDH("DH4", dh4);

      const masterKey = await CryptoService.deriveMasterKey([dh1, dh2, dh3, dh4] as any);
      const masterKeyB64 = CryptoService.toB64(new Uint8Array(masterKey as any));

      const currentAuth = await db.auth.toCollection().first();
      if (currentAuth) {
        const newSession: ChatSession = {
          chatId: serverChatId, chatName: '', sharedKey: masterKeyB64,
          status: 'encrypted', lastMessageAt: new Date(), membersId: [recipientId]
        };
        await db.auth.put({
          ...currentAuth,
          chats: [...(currentAuth.chats || []).filter(c => c.chatId !== serverChatId), newSession]
        });
      }

      return { systemContent: `${INIT_TAG}|${myAuth.identity.publicKey}|${ephemeral.publicKey}|${bundle.oneTimePreKey || 'none'}|${END_TAG}` };
    } catch (error) { throw error; }
  },

  async initializeReceiverSide(serverChatId: string, messageContent: string) {
    try {
      const parts = messageContent.split('|');
      const myAuth = await db.auth.toCollection().first();
      if (!myAuth) throw new Error("Сесія не ініціалізована");

      const aliceIdentityPubX = CryptoService.edPubToX(parts[1]);
      const bobIdentityPrivX = await CryptoService.edPrivToX(myAuth.identity.privateKey);

      const dh1 = CryptoService.calculateDH(myAuth.signedPreKey.privateKey, aliceIdentityPubX);
      const dh2 = CryptoService.calculateDH(bobIdentityPrivX, parts[2]);
      const dh3 = CryptoService.calculateDH(myAuth.signedPreKey.privateKey, parts[2]);
      
      let dh4 = new Uint8Array(32).fill(0);
      if (parts[3] !== 'none') {
        const opk = myAuth.oneTimePreKeys.find(k => k.publicKey === parts[3]);
        if (opk) dh4 = CryptoService.calculateDH(opk.privateKey, parts[2]);
      }

      debugDH("DH1", dh1);
      debugDH("DH2", dh2);
      debugDH("DH3", dh3);
      debugDH("DH4", dh4);

      const masterKey = await CryptoService.deriveMasterKey([dh1, dh2, dh3, dh4] as any);
      const masterKeyB64 = CryptoService.toB64(new Uint8Array(masterKey as any));

      const currentAuth = await db.auth.toCollection().first();
      if (currentAuth) {
        const newSession: ChatSession = {
          chatId: serverChatId, chatName: '', sharedKey: masterKeyB64, status: 'encrypted',
          lastMessageAt: new Date(), membersId: []
        };
        await db.auth.put({
          ...currentAuth,
          chats: [...(currentAuth.chats || []).filter(c => c.chatId !== serverChatId), newSession]
        });
      }
      return masterKeyB64;
    } catch (error) { return null; }
  }
};