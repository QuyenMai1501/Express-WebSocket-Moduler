import { ObjectId } from "mongodb";
import { ApiError } from "../../utils/http.js";
export class ChatService {
    chatDb;
    constructor(chatDb) {
        this.chatDb = chatDb;
    }
    async postMessage(input) {
        const text = (input.text ?? "").trim();
        if (!text)
            throw new ApiError(400, { message: "Message text is required" });
        if (text.length > 2000)
            throw new ApiError(400, { message: "Message too long (max 2000)" });
        const now = new Date();
        return this.chatDb.insert({
            userId: new ObjectId(input.userId),
            userEmail: input.userEmail,
            role: input.role,
            text,
            createdAt: now,
        });
    }
    async listHistory(input) {
        const limit = parsePositiveInt(input.limit, 50, 200);
        let beforeDate;
        if (input.before) {
            const d = new Date(input.before);
            if (Number.isNaN(d.getTime()))
                throw new ApiError(400, { message: "Invalid before ISO date" });
            beforeDate = d;
        }
        return this.chatDb.list({ limit, before: beforeDate });
    }
}
function parsePositiveInt(v, fallback, max) {
    if (!v)
        return fallback;
    const n = Number(v);
    if (!Number.isInteger(n) || n <= 0)
        return fallback;
    return Math.min(n, max);
}
//# sourceMappingURL=chat.service.js.map