import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  attachmentUrls: [{ type: String }],
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

const conversationSchema = new mongoose.Schema({
  gigId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig' },
  lastMessageAt: { type: Date },
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    unreadCount: { type: Number, default: 0 }
  }]
}, { timestamps: true });

export const Message = mongoose.model('Message', messageSchema);
export const Conversation = mongoose.model('Conversation', conversationSchema);
