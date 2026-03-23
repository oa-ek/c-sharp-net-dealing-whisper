export interface KeyPair {
  privateKey: string;
  publicKey: string;
}

export interface AuthEntity {
  deviceId: string; 
  token: string;
  identity: KeyPair;
  signedPreKey: KeyPair;
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