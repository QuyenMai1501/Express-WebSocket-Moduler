import type { ObjectId } from "mongodb";

export type ChatMessageDoc = {
  userId: ObjectId;
  userEmail: string;
  role: "customer" | "admin";

  text: string;

  isPublic: boolean;
  recipientId?: ObjectId | undefined;
  recipientEmail?: string | undefined;

  createdAt: Date;
};

export type ChatMessageEntity = ChatMessageDoc & { _id: ObjectId };
