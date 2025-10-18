import express from 'express';
import { userService } from '../services/userService';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await userService.list(page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/search', async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, error: 'Search query is required' });
    }
    const result = await userService.search(q as string, parseInt(page as string), parseInt(limit as string));
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await userService.read(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/follow', async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }
    const result = await userService.follow(req.params.id, userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/unfollow', async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }
    const result = await userService.unfollow(req.params.id, userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/followers', async (req, res, next) => {
  try {
    const followers = await userService.getFollowers(req.params.id);
    res.json(followers);
  } catch (error) {
    next(error);
  }
});

export default router;
