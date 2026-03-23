import Dexie, { type Table } from 'dexie';
import type { AuthEntity } from '../types/db';

export class WhisperDatabase extends Dexie {
  auth!: Table<AuthEntity>;

  constructor() {
    super('WhisperDB');
    this.version(1).stores({
      auth: 'deviceId' 
    });
  }
}

export const db = new WhisperDatabase();