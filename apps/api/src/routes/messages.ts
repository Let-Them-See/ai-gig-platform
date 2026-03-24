import { Router, Response } from 'express';
import { Conversation, Message } from '../models/Message';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get conversations for current user
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const conversations = await Conversation.find({
      'participants.user': req.userId
    })
      .populate('participants.user', 'name avatarUrl')
      .sort({ lastMessageAt: -1 })
      .lean();

    // Fetch the latest message for each conversation
    const mappedConvs = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = await Message.findOne({ conversationId: conv._id })
          .sort({ createdAt: -1 })
          .lean();

        const participant = conv.participants.find((p: any) => p.user._id.toString() === req.userId);

        return {
          ...conv,
          messages: lastMessage ? [lastMessage] : [],
          unreadCount: participant ? participant.unreadCount : 0,
        };
      })
    );

    res.json({ data: mappedConvs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get messages in a conversation
router.get('/:conversationId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
      .sort({ createdAt: 1 });

    // Mark as read
    await Conversation.updateOne(
      { _id: req.params.conversationId, 'participants.user': req.userId },
      { $set: { 'participants.$.unreadCount': 0 } }
    );

    res.json({ data: messages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message
router.post('/:conversationId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const message = await Message.create({
      conversationId: req.params.conversationId,
      senderId: req.userId!,
      content: req.body.content,
      attachmentUrls: req.body.attachmentUrls || [],
    });

    // Update conversation lastMessageAt and increment unread for other participants
    await Conversation.findOneAndUpdate(
      { _id: req.params.conversationId },
      {
        $set: { lastMessageAt: new Date() },
        $inc: { 'participants.$[elem].unreadCount': 1 }
      },
      {
        arrayFilters: [{ 'elem.user': { $ne: req.userId } }],
        new: true
      }
    );

    res.status(201).json({ data: message });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Start a new conversation
router.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { recipientId, gigId, message: messageContent } = req.body;

    const conversation = await Conversation.create({
      gigId,
      lastMessageAt: new Date(),
      participants: [
        { user: req.userId!, unreadCount: 0 },
        { user: recipientId, unreadCount: 1 },
      ],
    });

    const message = await Message.create({
      conversationId: conversation._id,
      senderId: req.userId!,
      content: messageContent,
    });

    const populatedConv = await Conversation.findById(conversation._id)
      .populate('participants.user', 'name avatarUrl')
      .lean();

    res.status(201).json({
      data: {
        ...populatedConv,
        messages: [message]
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

export default router;
