import type { Request, Response } from "express";
import type { ChatService } from "./chat.service.js";
import { ok } from "../../utils/http.js";

export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // GET /api/chat/messages?limit=50&before=...&scope=public|private&with=<userId>
  listMessages = async (req: Request, res: Response) => {
    // assume requireAuth sets req.user with id field when needed for private
    const user = (req as any).user;
    const query = { ...(req.query as any), userId: user?.id } as any;
    const messages = await this.chatService.listHistory(query);
    res.json(
      ok(
        messages.map((m) => ({
          id: m._id.toString(),
          userEmail: m.userEmail,
          role: m.role,
          text: m.text,
          isPublic: m.isPublic,
          recipientEmail: m.recipientEmail,
          recipientId: m.recipientId?.toString(),
          createdAt: m.createdAt,
        }))
      )
    );
  };

  // POST /api/chat/messages
  postMessage = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const payload = req.body;
    const created = await this.chatService.postMessage({
      userId: user.id,
      userEmail: user.email,
      role: user.role,
      text: payload.text,
      isPublic: payload.isPublic,
      recipientId: payload.recipientId,
      recipientEmail: payload.recipientEmail,
    });

    res.json(
      ok({
        id: created._id.toString(),
        userEmail: created.userEmail,
        text: created.text,
        isPublic: created.isPublic,
        recipientEmail: created.recipientEmail,
        recipientId: created.recipientId?.toString(),
        createdAt: created.createdAt,
      })
    );
  };
}
