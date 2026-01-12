import { getDb } from "../../database/mongo.js";
export class ChatDatabase {
    col() {
        return getDb().collection("chat_messages");
    }
    async insert(doc) {
        const res = await this.col().insertOne(doc);
        return { ...doc, _id: res.insertedId };
    }
    async list(params) {
        const filter = {};
        if (params.before)
            filter.createdAt = { $lt: params.before };
        if (params.scope === "public") {
            filter.isPublic = true;
        }
        else if (params.scope === "private") {
            filter.isPublic = false;
            if (params.userId && params.withUserId) {
                filter.$or = [
                    { userId: params.userId, recipientId: params.withUserId },
                    { userId: params.withUserId, recipientId: params.userId },
                ];
            }
            else if (params.userId) {
                filter.$or = [{ userId: params.userId }, { recipientId: params.userId }];
            }
        }
        return this.col()
            .find(filter)
            .sort({ createdAt: -1, _id: -1 })
            .limit(params.limit)
            .toArray();
    }
}
//# sourceMappingURL=chat.database.js.map