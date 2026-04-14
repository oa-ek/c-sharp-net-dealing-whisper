import agent from "../api/agent";
import { EncryptionService } from "../services/encryptionService";

export const ChatService = {
  async createNewChat(recipientId: string, recipientName: string, recipientDeviceId: string) {
    try {
      const serverChat = await agent.Chats.create(recipientId, recipientName);
      
      await EncryptionService.initializeChat(
        serverChat.id.toString(), 
        recipientId, 
        recipientDeviceId
      );

      return serverChat;
    } catch (error) {
      console.error("Помилка ініціалізації чату:", error);
      throw error;
    }
  }
};