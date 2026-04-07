import Dexie, { type Table } from 'dexie';
import type { AuthEntity } from '../types/db'; // Імпортуємо AuthEntity

export class WhisperDatabase extends Dexie {
  auth!: Table<AuthEntity>;

  constructor() {
    super('WhisperDB');
    this.version(1).stores({
      auth: '++id, deviceId' // Додав ++id як автоінкремент, якщо він потрібен
    });
  }
}

export const db = new WhisperDatabase();

/**
 * Отримує JWT токен з IndexedDB (Dexie)
 */
export const getAuthTokenFromDB = async (): Promise<string | null> => {
  try {
    // Отримуємо останній запис авторизації
    const authRecord = await db.auth.toCollection().last();
    
    // В твоїй AuthEntity поле називається 'token'
    return authRecord ? authRecord.token : null;
  } catch (error) {
    console.error("Dexie error fetching token:", error);
    return null;
  }
};