import express from 'express';
import NotificacaoController from '../controllers/NotificacaoController.js';

const router = express.Router();

router.get('/usuario/:usuarioId', NotificacaoController.getByUsuario);
router.post('/', NotificacaoController.create);
router.put('/:id/read', NotificacaoController.markAsRead);
router.delete('/:id', NotificacaoController.delete);

export default router;
