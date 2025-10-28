import express from 'express';
import UsuarioController from '../controllers/UsuarioController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', UsuarioController.register);
router.post('/login', UsuarioController.login);
router.get('/:id', auth, UsuarioController.getProfile);
router.put('/:id', auth, UsuarioController.updateProfile);
router.get('/:id/followers', auth, UsuarioController.getFollowers);
router.get('/:id/following', auth, UsuarioController.getFollowing);
router.get('/:id/followers/count', auth, UsuarioController.getFollowersCount);
router.get('/:id/following/count', auth, UsuarioController.getFollowingCount);

export default router;
