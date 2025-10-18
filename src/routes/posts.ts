import express from 'express';
import { postService } from '../services/postService';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await postService.list(page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const post = await postService.read(req.params.id);
    res.json(post);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const post = await postService.create(req.body);
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/comments', async (req, res, next) => {
  try {
    const postId = req.params.id;
    const {content, author} = req.body;

    if(!content || !author) {
      return res.status(400).json({
        error: 'Content and author are required'
      })
    }

    const updatedPost = await postService.addComment(postId, {content, author});
    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/likes', async (req, res, next) => {
  try {
    const postId = req.params.id;
    const {userId} = req.body;

  if (!userId) {
    return res.status(400).json({
      error: 'UserId is required for liking posts'
    });
  }

    const updatedPost = await postService.toggleLike(postId, userId);
    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
});


export default router;
