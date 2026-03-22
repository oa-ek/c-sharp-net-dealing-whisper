import Dexie from 'dexie';

export const db = new Dexie('WhisperDB');

db.version(1).stores({
  messages: '++id, chatId, senderId, timestamp', 
  keyStore: 'name', 
  config: 'key'    
});