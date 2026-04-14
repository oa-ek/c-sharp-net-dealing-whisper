import * as signalR from "@microsoft/signalr";
import type { MessageCreateDto, MessageDto, ReactionCreateDto } from "../types/chat";
import { db } from "../api/db";
import { EncryptionService } from "./encryptionService";
import type { ChatSession } from "../types/db";

class ChatSocketService {
    private connection: signalR.HubConnection | null = null;

    public async startConnection(token: string): Promise<void> {
        if (this.connection?.state === signalR.HubConnectionState.Connected) return;

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("https://26.205.72.169:7055/ws/v1/chat", {
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


public onMessageNew(callback: (message: any) => void) {
    this.connection?.on("message-new", async (message: any) => {
        const auth = await db.auth.toCollection().first();
        const chatExists = auth?.chats?.some(c => c.chatId === message.chatId);

        if (message.ciphertext.startsWith("#InitCode")) {
            await EncryptionService.initializeReceiverSide(message.chatId, message.ciphertext);
            return; 
        }

        callback(message);
    });
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