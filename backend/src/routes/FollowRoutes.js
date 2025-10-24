import express from 'express';
import FollowController from '../controllers/FollowController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Seguir um usuário
router.post('/', auth, FollowController.follow);

// Deixar de seguir um usuário
router.delete('/:id', auth, FollowController.unfollow);

// Obter seguidores de um usuário
router.get('/:id/followers', FollowController.getFollowers);

// Obter usuários que um usuário está seguindo
router.get('/:id/following', FollowController.getFollowing);

export default router;
