import * as signalR from "@microsoft/signalr";
import type { MessageCreateDto, ReactionCreateDto } from "../types/chat";
import { EncryptionService } from "./encryptionService";

class ChatSocketService {
    private connection: signalR.HubConnection | null = null;

    public async startConnection(token: string): Promise<void> {
        if (this.connection?.state === signalR.HubConnectionState.Connected) return;


        const baseUrl = import.meta.env.VITE_API_URL;
        
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${baseUrl}/ws/v1/chat`, {
                accessTokenFactory: () => token,
            })
            .withAutomaticReconnect() 
            .build();

        try {
            await this.connection.start();
            console.log("Whisper WebSockets: Connected");
        } catch (err) {
            console.error("Whisper WebSockets Connection Error: ", err);
            throw err;
        }
    }

    public isConnected(): boolean {
        return this.connection?.state === signalR.HubConnectionState.Connected;
    }

    public async joinChat(chatId: string) {
        if (this.isConnected()) {
            await this.connection?.invoke("JoinChat", chatId);
        } else {
            console.warn("JoinChat failed: Socket not connected");
        }
    }

    public async sendMessage(message: MessageCreateDto) {
        if (this.isConnected()) {
            await this.connection?.invoke("MessageSend", message);
        } else {
            console.error("Cannot send message: WebSocket is not connected");
        }
    }

    public async addReaction(reaction: ReactionCreateDto) {
        if (this.isConnected()) {
            await this.connection?.invoke("ReactionAdd", reaction);
        }
    }

    public async startTyping(chatId: string) {
        if (this.isConnected()) {
            await this.connection?.invoke("TypingStart", chatId);
        }
    }

    public async stopTyping(chatId: string) {
        if (this.isConnected()) {
            await this.connection?.invoke("TypingStop", chatId);
        }
    }
    public async markAsRead(messageId: string) {
        if (this.isConnected()) {
            await this.connection?.invoke("MessageRead", messageId); 
        }
    }
    public async confirmDelivery(messageId: string) {
        if (this.isConnected()) {
            await this.connection?.invoke("MessageDeliver", messageId);
        }
    }

public onMessageNew(callback: (message: any) => void) {
  this.connection?.on("message-new", async (message: any) => {
    if (message.ciphertext && message.ciphertext.startsWith("#InitCode")) {
      console.log("🔑 [Socket] Handshake received for chat:", message.chatId);
      await EncryptionService.initializeReceiverSide(message.chatId, message.ciphertext);
      return; 
    }

    callback(message);
  });
}

    public onMessageRead(callback: (updatedMessage: any) => void) {
        this.connection?.on("message-read", callback);
    }

    public onMessageDelivered(callback: (updatedMessage: any) => void) {
        this.connection?.on("message-delivered", callback);
    }

    public onTypingStarted(callback: (userId: string) => void) {
        this.connection?.on("typing-start", callback);
    }

    public onTypingStopped(callback: (userId: string) => void) {
        this.connection?.on("typing-stop", callback);
    }

    public offAll() {
        if (this.connection) {
            this.connection.off("message-new");
            this.connection.off("typing-start");
            this.connection.off("message-read");
            this.connection.off("typing-stop");
        }
    }

    public async stopConnection() {
        if (this.connection) {
            await this.connection.stop();
            this.connection = null;
            console.log("🔌 Whisper WebSockets: Disconnected");
        }
    }
}

export default new ChatSocketService();