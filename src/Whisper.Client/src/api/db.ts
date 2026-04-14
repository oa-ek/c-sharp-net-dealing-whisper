import Dexie, { type Table } from 'dexie';
import type { AuthEntity } from '../types/db';


export class WhisperDatabase extends Dexie {
  auth!: Table<AuthEntity>;

  constructor() {
    super('WhisperDB');
    
    this.version(3).stores({
      auth: '++id, deviceId',
    });
  }
}

export const db = new WhisperDatabase();

export const getAuthTokenFromDB = async (): Promise<string | null> => {
  try {
    const record = await db.auth.toCollection().last();
    return record?.token || null;
  } catch {
    return null;
  }
};

export const getDeviceIdFromDB = async (): Promise<string | null> => {
  try {
    const record = await db.auth.toCollection().last();
    return record?.deviceId || null;
  } catch {
    return null;
  }
};

export const clearAuthData = async () => {
  try {
    await db.auth.toCollection().modify({ token: null });
  } catch (error) {
    console.error("Failed to clear auth token:", error);
  }
};

export const wipeLocalData = async () => {
  try {
    await db.close();
    await Dexie.delete("WhisperDB");
    console.warn("Local database WhisperDB has been deleted.");
  } catch (error) {
    console.error("Failed to wipe local data:", error);
  }
};