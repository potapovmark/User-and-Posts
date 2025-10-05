import { User, IUser } from '../models/User';
import mongoose from 'mongoose';

export const userService = {
  async list(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  async read(id: string) {
    const user = await User.findById(id)
      .select('-password')
      .populate('followers', 'username profile')
      .populate('following', 'username profile');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  },

  async create(userData: Partial<IUser>) {
    const user = await User.create(userData);
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      profile: user.profile,
      followers: user.followers,
      following: user.following,
      createdAt: (user as any).createdAt,
      updatedAt: (user as any).updatedAt
    };
  },

  async follow(userId: string, followerId: string) {
    const user = await User.findById(userId);
    const follower = await User.findById(followerId);

    if (!user || !follower) {
      throw new Error('User not found');
    }

    if (user.followers.some(id => id.equals(follower._id as any))) {
      throw new Error('Already following this user');
    }

    user.followers.push(follower._id as mongoose.Types.ObjectId);
    follower.following.push(user._id as mongoose.Types.ObjectId);

    await user.save();
    await follower.save();

    return { message: 'Successfully followed user' };
  },

  async unfollow(userId: string, followerId: string) {
    const user = await User.findById(userId);
    const follower = await User.findById(followerId);

    if (!user || !follower) {
      throw new Error('User not found');
    }

    user.followers = user.followers.filter(id => !id.equals(follower._id as any));
    follower.following = follower.following.filter(id => !id.equals(user._id as any));

    await user.save();
    await follower.save();

    return { message: 'Successfully unfollowed user' };
  },

  async getFollowers(userId: string) {
    const user = await User.findById(userId)
      .populate('followers', 'username profile')
      .select('followers');

    if (!user) {
      throw new Error('User not found');
    }

    return user.followers;
  },

  async search(query: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { 'profile.firstName': { $regex: query, $options: 'i' } },
        { 'profile.lastName': { $regex: query, $options: 'i' } }
      ]
    })
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { 'profile.firstName': { $regex: query, $options: 'i' } },
        { 'profile.lastName': { $regex: query, $options: 'i' } }
      ]
    });

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
};
