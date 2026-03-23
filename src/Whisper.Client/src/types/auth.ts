export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiration: string;
  deviceId: string;
}

export interface LoginData {
  email: string;
  password: string;
  deviceId: string; 
}

export interface RegisterData {
  username: string;
  email: string;
  password?: string;
  deviceName?: string;
  deviceType?: string;
  publicIdentityKey: string;
  signedPreKey: string;
  signedPreKeySignature: string;
  oneTimePreKeys: string[];
}