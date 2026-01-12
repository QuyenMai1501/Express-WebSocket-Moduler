import type { Request, Response } from "express";
import type { ChatService } from "./chat.service.js";
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    listMessages: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=chat.controller.d.ts.map