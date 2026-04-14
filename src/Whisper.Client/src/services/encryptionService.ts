import { CryptoService } from "./cryptoService";
import agent from "../api/agent";
import { db } from "../api/db";
import type { ChatSession } from "../types/db";

const INIT_TAG = "#InitCode";
const END_TAG = "-#InitCode";

export const EncryptionService = {
  async initializeChat(serverChatId: string, recipientId: string, recipientDeviceId: string) {
    try {
      const bundle = await agent.Keys.getBundle(recipientDeviceId);
      const myAuth = await db.auth.toCollection().first();
      if (!myAuth) throw new Error("Сесія не ініціалізована");

      const ephemeral = CryptoService.generateOneTimePreKeys(1)[0];
      const dh1 = CryptoService.calculateDH(myAuth.identity.privateKey, bundle.signedPreKey);
      const dh2 = CryptoService.calculateDH(ephemeral.privateKey, bundle.publicIdentityKey);
      const dh3 = CryptoService.calculateDH(ephemeral.privateKey, bundle.signedPreKey);
      const dh4 = bundle.oneTimePreKey 
        ? CryptoService.calculateDH(ephemeral.privateKey, bundle.oneTimePreKey)
        : new Uint8Array(32).fill(0);

      const masterKey = await CryptoService.deriveMasterKey([dh1, dh2, dh3, dh4]);
      const masterKeyB64 = CryptoService.toB64(new Uint8Array(masterKey));

      const currentAuth = await db.auth.toCollection().first();
      if (currentAuth) {
        const newSession: ChatSession = {
          chatId: serverChatId,
          chatName: '',
          sharedKey: masterKeyB64,
          status: 'encrypted',
          lastMessageAt: new Date(),
          membersId: [recipientId]
        };
        const updatedChats = [...(currentAuth.chats || []).filter(c => c.chatId !== serverChatId), newSession];
        await db.auth.put({ ...currentAuth, chats: updatedChats });
      }

      const systemContent = `${INIT_TAG}\n${myAuth.identity.publicKey}\n${ephemeral.publicKey}\n${bundle.oneTimePreKeyId || 'none'}\n${END_TAG}\nSecure session established`;

      return { systemContent };
    } catch (error) {
      console.error("🚨 X3DH Alice Error:", error);
      throw error;
    }
  },

  async initializeReceiverSide(serverChatId: string, messageContent: string) {
    try {
        console.log(messageContent);
      if (!messageContent.startsWith(INIT_TAG)) return null;

      const lines = messageContent.split('\n');
      const aliceIdentityKey = lines[1];
      const aliceEphemeralKey = lines[2];
      const usedPreKeyId = lines[3] === 'none' ? undefined : lines[3];

      const myAuth = await db.auth.toCollection().first();
      if (!myAuth) throw new Error("Сесія не ініціалізована");

      const dh1 = CryptoService.calculateDH(myAuth.signedPreKey.privateKey, aliceIdentityKey);
      const dh2 = CryptoService.calculateDH(myAuth.identity.privateKey, aliceEphemeralKey);
      const dh3 = CryptoService.calculateDH(myAuth.signedPreKey.privateKey, aliceEphemeralKey);
      
      let dh4 = new Uint8Array(32).fill(0);
      if (usedPreKeyId) {
        const opk = myAuth.oneTimePreKeys.find(k => k.publicKey === usedPreKeyId);
        if (opk) dh4 = CryptoService.calculateDH(opk.privateKey, aliceEphemeralKey);
      }

      const masterKey = await CryptoService.deriveMasterKey([dh1, dh2, dh3, dh4]);
      const masterKeyB64 = CryptoService.toB64(new Uint8Array(masterKey));

      const currentAuth = await db.auth.toCollection().first();
      if (currentAuth) {
        const newSession: ChatSession = {
          chatId: serverChatId,
          chatName: '',
          sharedKey: masterKeyB64,
          status: 'encrypted',
          lastMessageAt: new Date(),
          membersId: []
        };
        const updatedChats = [...(currentAuth.chats || []).filter(c => c.chatId !== serverChatId), newSession];
        await db.auth.put({ ...currentAuth, chats: updatedChats });
      }
      console.log(`✅ Боб ініціалізував чат ${serverChatId} через системне повідомлення`);
      return masterKeyB64;
    } catch (error) {
      console.error("🚨 X3DH Bob Error:", error);
      return null;
    }
  }
};