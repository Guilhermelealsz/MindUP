import express from 'express';
import UsuarioController from '../controllers/UsuarioController.js';

const router = express.Router();

router.post('/register', UsuarioController.register);
router.post('/login', UsuarioController.login);
router.get('/:id', UsuarioController.getProfile);
router.put('/:id', UsuarioController.updateProfile);
router.get('/:id/followers', UsuarioController.getFollowers);
router.get('/:id/following', UsuarioController.getFollowing);
router.get('/:id/followers/count', UsuarioController.getFollowersCount);
router.get('/:id/following/count', UsuarioController.getFollowingCount);

export default router;
