import type { Request, Response } from "express";
import type { ChatService } from "./chat.service.js";
import { ok } from "../../utils/http.js";

export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // GET /api/chat/messages?limit=50&before=2026-01-05T00:00:00.000Z
  listMessages = async (req: Request, res: Response) => {
    const messages = await this.chatService.listHistory(req.query as any);
    res.json(
      ok(
        messages.map((m) => ({
          id: m._id.toString(),
          userEmail: m.userEmail,
          role: m.role,
          text: m.text,
          createdAt: m.createdAt,
        }))
      )
    );
  };
}
