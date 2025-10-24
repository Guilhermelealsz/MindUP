import express from 'express';
import PostController from '../controllers/PostController.js';

const router = express.Router();

router.get('/', PostController.getAll);
router.get('/:id', PostController.getById);
router.post('/', PostController.create);
router.put('/:id', PostController.update);
router.delete('/:id', PostController.delete);
router.get('/categoria/:categoriaId', PostController.getByCategoria);
router.get('/usuario/:userId', PostController.getByUser);

export default router;
