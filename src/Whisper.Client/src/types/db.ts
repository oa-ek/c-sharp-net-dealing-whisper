export interface KeyPair {
  privateKey: string;
  publicKey: string;
}

export interface SignedKeyPair extends KeyPair {
  signature: string; 
}

export interface AuthEntity {
  deviceId: string; 
  token: string | null;
  identity: KeyPair;
  signedPreKey: SignedKeyPair;
  oneTimePreKeys: KeyPair[];
  chats: ChatSession[];  
  id?: number; 
}

export interface ChatSession {
  chatId: string; 
  chatName: string;
  sharedKey: string;        
  status: 'encrypted' | 'pending';
  lastMessageAt?: Date;
  membersId: string[]; 
}