import express from 'express';
import NotificacaoController from '../controllers/NotificacaoController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/usuario/:usuarioId', auth, NotificacaoController.getByUsuario);
router.put('/:id/read', auth, NotificacaoController.markAsRead);
router.delete('/:id', auth, NotificacaoController.delete);

export default router;
