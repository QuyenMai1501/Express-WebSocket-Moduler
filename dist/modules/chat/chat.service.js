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
        const isPublic = input.isPublic ?? true;
        if (!isPublic && !input.recipientId && !input.recipientEmail) {
            throw new ApiError(400, { message: "Private message requires a recipient" });
        }
        const now = new Date();
        return this.chatDb.insert({
            userId: new ObjectId(input.userId),
            userEmail: input.userEmail,
            role: input.role,
            text,
            isPublic,
            recipientId: input.recipientId ? new ObjectId(input.recipientId) : undefined,
            recipientEmail: input.recipientEmail,
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
        const scope = input.scope === "private" ? "private" : "public";
        const userId = input.userId ? new ObjectId(input.userId) : undefined;
        const withUserId = input.withUserId ? new ObjectId(input.withUserId) : undefined;
        return this.chatDb.list({
            limit,
            before: beforeDate,
            scope,
            userId,
            withUserId,
        });
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