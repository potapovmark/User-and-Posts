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
    const post = await Post.findById(id)
      .populate('author', 'username profile')
      .populate('comments.author', 'username profile')
      .populate('likes', 'username profile');

    if (!post) {
      throw new Error('Post not found');
    }

    return post;
  },

  async addComment(postId: string, commentData: { content: string; author: string }) {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    post.comments.push({
      content: commentData.content,
      author: commentData.author
    } as any);

    await post.save();

    return await Post.findById(postId)
      .populate('author', 'username profile')
      .populate('comments.author', 'username profile')
      .populate('likes', 'username profile');
  },

  async toggleLike(postId: string, userId: string) {
    const post = await Post.findById(postId);
    if(!post) {
      throw new Error('Post not found');
    }

    const LikeIndex = post.likes.findIndex(like => like.toString() === userId);
    if(LikeIndex > -1) {
      post.likes.splice(LikeIndex, 1);
    } else {
      post.likes.push(userId as any);
    }
    await post.save();
    return await Post.findById(postId)
      .populate('author', 'username profile')
      .populate('comments.author', 'username profile')
      .populate('likes', 'username profile');
  }

};
