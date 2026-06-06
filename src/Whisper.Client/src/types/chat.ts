export interface ChatDto {
    id: string;
    name: string;
    isGroup: boolean;
    createdBy: Date;
}

export interface MessageCreateDto {
    chatId: string;
    ciphertext: string;
    wrappedKey: string;
    parentMessageId?: string;
    attachments: any[]; 
}

export interface MessageUpdateDto {
    id: string;
    ciphertext: string;
    wrappedKey: string;
    attachments: any[];
}

export interface MessageDto {
    id: string;
    chatId: string;
    senderId: string;
    ciphertext: string;
    wrappedKey: string;
    parentMessageId?: string;
    createdAt: string;
    updatedAt: string;
    attachments: any[];
    reactions: any[];
}

export interface ReactionCreateDto {
    messageId: string;
    emoji: string;
}