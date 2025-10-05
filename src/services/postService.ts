import { Post, IPost } from '../models/Post';

export const postService = {
  async create(postData: Partial<IPost>) {
    const post = await Post.create(postData);
    return await Post.findById(post._id)
      .populate('author', 'username profile');
  },

  async list(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const posts = await Post.find({ status: 'published' })
      .populate('author', 'username profile')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments({ status: 'published' });

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  async read(id: string) {
    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'username profile');

    if (!post) {
      throw new Error('Post not found');
    }

    return post;
  }
};
