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

export default router;
