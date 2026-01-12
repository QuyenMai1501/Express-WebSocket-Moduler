import { ok } from "../../utils/http.js";
export class ChatController {
    chatService;
    constructor(chatService) {
        this.chatService = chatService;
    }
    // GET /api/chat/messages?limit=50&before=2026-01-05T00:00:00.000Z
    listMessages = async (req, res) => {
        const messages = await this.chatService.listHistory(req.query);
        res.json(ok(messages.map((m) => ({
            id: m._id.toString(),
            userEmail: m.userEmail,
            role: m.role,
            text: m.text,
            createdAt: m.createdAt,
        }))));
    };
}
//# sourceMappingURL=chat.controller.js.map