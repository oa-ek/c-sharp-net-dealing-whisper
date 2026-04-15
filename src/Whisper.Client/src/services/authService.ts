import agent from "../api/agent";
import { db } from "../api/db";
import { CryptoService } from "./cryptoService";
import { getDeviceInfo } from "../utils/deviceUtils"; 
import type { RegisterData } from "../types/auth";

export const AuthService = {
    async register(username: string, email: string, password: string) {
        const identity = CryptoService.generateIdentityKeys();
        const signedPreKey = CryptoService.generateSignedPreKey(identity.privateKey);
        const oneTimePreKeys = CryptoService.generateOneTimePreKeys(50);

        const device = getDeviceInfo();

        const registerDto: RegisterData = {
            username,
            email,
            password,
            deviceName: device.name,
            deviceType: device.type,
            publicIdentityKey: identity.publicKey,
            signedPreKey: signedPreKey.publicKey,
            signedPreKeySignature: signedPreKey.signature,
            oneTimePreKeys: oneTimePreKeys.map(k => k.publicKey)
        };

        const response = await agent.Auth.register(registerDto);

        await db.auth.put({
            deviceId: response.deviceId,
            token: response.accessToken,
            identity: identity,
            signedPreKey: signedPreKey,
            oneTimePreKeys: oneTimePreKeys,
            chats: []
        });

        return response;
    }
};