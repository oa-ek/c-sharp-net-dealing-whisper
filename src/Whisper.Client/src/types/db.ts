export interface KeyPair {
  privateKey: string;
  publicKey: string;
}

export interface SignedKeyPair extends KeyPair {
  signature: string; 
}

export interface AuthEntity {
  deviceId: string; 
  token: string;
  identity: KeyPair;
  signedPreKey: SignedKeyPair;
  oneTimePreKeys: KeyPair[];
  chats: ChatEntity[];
  id?: number; 
}

export interface ChatEntity {
  chatId: string; 
  chatName: string;
  conversationKey: string;
  memberId: string; 
}