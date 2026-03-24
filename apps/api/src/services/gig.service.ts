// import { prisma } from '../config/prisma';
import { Gig } from '../models/Gig';
import { User } from '../models/User';
import { aiService } from './ai.service';

export class GigService {
  async createGig(data: {
    clientId: string;
    title: string;
    description: string;
    requirements?: string;
    budget: number;
    budgetType: string;
    deadline?: Date;
    category: string;
    experienceLevel: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';
    skillIds: string[];
    isRemote: boolean;
  }) {
    const gig = await Gig.create({
      clientId: data.clientId,
      title: data.title,
      description: data.description,
      requirements: data.requirements,
      budget: data.budget,
      budgetType: data.budgetType,
      deadline: data.deadline,
      category: data.category,
      experienceLevel: data.experienceLevel,
      isRemote: data.isRemote,
      status: 'OPEN',
      publishedAt: new Date(),
      skills: data.skillIds,
    });

    const populatedGig = await Gig.findById(gig._id).populate('clientId', 'name avatarUrl').lean();

    // Generate AI embedding in background
    try {
      const embedding = await aiService.generateGigEmbedding(
        `${data.title} ${data.description} ${data.requirements ?? ''}`
      );
      await Gig.findByIdAndUpdate(gig._id, { aiEmbedding: embedding });
    } catch (err) {
      console.error('Failed to generate embedding:', err);
    }

    return populatedGig;
  }

  async getGigs(filters: {
    category?: string;
    minBudget?: number;
    maxBudget?: number;
    experienceLevel?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
  }) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const query: any = { status: filters.status || 'OPEN' };
    
    if (filters.category) query.category = filters.category;
    if (filters.experienceLevel) query.experienceLevel = filters.experienceLevel;
    
    if (filters.minBudget || filters.maxBudget) {
      query.budget = {};
      if (filters.minBudget) query.budget.$gte = filters.minBudget;
      if (filters.maxBudget) query.budget.$lte = filters.maxBudget;
    }
    
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    let sort: any = { createdAt: -1 };
    if (filters.sortBy === 'budget_high') sort = { budget: -1 };
    if (filters.sortBy === 'budget_low') sort = { budget: 1 };

    const [gigs, total] = await Promise.all([
      Gig.find(query)
        .populate('clientId', 'name avatarUrl')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Gig.countDocuments(query),
    ]);

    // Transform _id and clientId
    const formattedGigs = gigs.map((g: any) => ({
      ...g,
      id: g._id.toString(),
      client: g.clientId,
      clientId: undefined,
      _id: undefined
    }));

    return {
      data: formattedGigs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getGigById(id: string) {
    const gig = await Gig.findById(id)
      .populate('clientId', 'name avatarUrl')
      .populate('freelancerId', 'name avatarUrl')
      .lean();

    if (gig) {
      await Gig.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
      
      return {
        ...gig,
        id: gig._id?.toString(),
        client: gig.clientId,
        freelancer: gig.freelancerId,
        clientId: undefined,
        freelancerId: undefined,
        _id: undefined
      };
    }

    return null;
  }
}

export const gigService = new GigService();
