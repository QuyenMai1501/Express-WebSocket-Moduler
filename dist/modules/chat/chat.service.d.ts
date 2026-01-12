import type { ChatDatabase } from "./chat.database.js";
export declare class ChatService {
    private readonly chatDb;
    constructor(chatDb: ChatDatabase);
    postMessage(input: {
        userId: string;
        userEmail: string;
        role: "customer" | "admin";
        text: string;
        isPublic?: boolean;
        recipientId?: string;
        recipientEmail?: string;
    }): Promise<import("./chat.model.js").ChatMessageEntity>;
    listHistory(input: {
        limit?: string;
        before?: string;
        scope?: string;
        userId?: string | undefined;
        withUserId?: string | undefined;
    }): Promise<import("./chat.model.js").ChatMessageEntity[]>;
}
//# sourceMappingURL=chat.service.d.ts.map