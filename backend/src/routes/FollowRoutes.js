import express from 'express';
import FollowController from '../controllers/FollowController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Seguir um usuário
router.post('/', auth, FollowController.follow);

// Deixar de seguir um usuário
router.delete('/:id', auth, FollowController.unfollow);

export default router;
