import { CryptoService } from "./cryptoService";
import agent from "../api/agent";
import { db } from "../api/db";
import type { ChatSession } from "../types/db";

export const EncryptionService = {
  async initializeChat(serverChatId: string, recipientId: string, recipientDeviceId: string) {
    try {
        const bundle = await agent.Keys.getBundle(recipientId, recipientDeviceId);
        
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
            const chats = currentAuth.chats || [];
            const newSession: ChatSession = {
            chatId: serverChatId,
            chatName: '',
            sharedKey: masterKeyB64,
            status: 'encrypted',
            lastMessageAt: new Date(),
            membersId: [recipientId]
            };

            const updatedChats = [...chats.filter(c => c.chatId !== serverChatId), newSession];

            await db.auth.put({
            ...currentAuth,
            chats: updatedChats
            });
        }

        return {
            masterKey: masterKeyB64,
            aliceIdentityKey: myAuth.identity.publicKey,
            ephemeralPublicKey: ephemeral.publicKey,    
            usedOneTimePreKeyId: bundle.oneTimePreKeyId 
        };
        } catch (error) {
        throw error;
        }
    },


    async initializeReceiverSide(serverChatId: string, alicePublicKey: string, aliceEphemeralKey: string, usedPreKeyId?: string) {
        try {
        const myAuth = await db.auth.toCollection().first();
        if (!myAuth) throw new Error("Сесія не ініціалізована");

        const dh1 = CryptoService.calculateDH(myAuth.signedPreKey.privateKey, alicePublicKey);
        const dh2 = CryptoService.calculateDH(myAuth.identity.privateKey, aliceEphemeralKey);
        const dh3 = CryptoService.calculateDH(myAuth.signedPreKey.privateKey, aliceEphemeralKey);
        
        let dh4 = new Uint8Array(32).fill(0);
        if (usedPreKeyId) {
            const opk = myAuth.oneTimePreKeys.find(k => k.publicKey === usedPreKeyId);
            if (opk) {
            dh4 = CryptoService.calculateDH(opk.privateKey, aliceEphemeralKey);
            }
        }

        const masterKey = await CryptoService.deriveMasterKey([dh1, dh2, dh3, dh4]);
        const masterKeyB64 = CryptoService.toB64(new Uint8Array(masterKey));

        const currentAuth = await db.auth.toCollection().first();
        if (currentAuth) {
            const chats = currentAuth.chats || [];
            const newSession: ChatSession = {
            chatId: serverChatId,
            chatName: '',
            sharedKey: masterKeyB64,
            status: 'encrypted',
            lastMessageAt: new Date(),
            membersId: []
            };

            await db.auth.put({
            ...currentAuth,
            chats: [...chats.filter(c => c.chatId !== serverChatId), newSession]
            });
        }
        return masterKeyB64;
        } catch (error) {
        throw error;
        }
    }
};