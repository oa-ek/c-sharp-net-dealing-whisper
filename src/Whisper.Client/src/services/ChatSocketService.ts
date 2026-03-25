import * as signalR from "@microsoft/signalr";
import type { MessageCreateDto, MessageDto, ReactionCreateDto } from "../types/chat";

class ChatSocketService {
    private connection: signalR.HubConnection | null = null;

    public async startConnection(token: string): Promise<void> {
        if (this.connection) return; 

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7055/ws/v1/chat", {
                accessTokenFactory: () => token,
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .build();

        try {
            await this.connection.start();
            console.log("Whisper WebSockets: Connected");
        } catch (err) {
            console.error("Whisper WebSockets Error: ", err);
        }
    }

    public async joinChat(chatId: string) {
        await this.connection?.invoke("JoinChat", chatId);
    }

    public async sendMessage(message: MessageCreateDto) {
        await this.connection?.invoke("MessageSend", message);
    }

    public async addReaction(reaction: ReactionCreateDto) {
        await this.connection?.invoke("ReactionAdd", reaction);
    }

    public async startTyping(chatId: string) {
        await this.connection?.invoke("TypingStart", chatId);
    }

    public async stopTyping(chatId: string) {
        await this.connection?.invoke("TypingStop", chatId);
    }


    public onMessageNew(callback: (message: MessageDto) => void) {
        this.connection?.on("message-new", callback);
    }

    public onTypingStarted(callback: (userId: string) => void) {
        this.connection?.on("typing-start", callback);
    }

    public onTypingStopped(callback: (userId: string) => void) {
        this.connection?.on("typing-stop", callback);
    }

    public offAll() {
        this.connection?.off("message-new");
        this.connection?.off("typing-start");
        this.connection?.off("typing-stop");
    }
}

export default new ChatSocketService();