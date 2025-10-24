import express from 'express';
import ComentarioController from '../controllers/ComentarioController.js';

const router = express.Router();

router.post('/', ComentarioController.create);
router.get('/post/:postId', ComentarioController.getByPostId);
router.delete('/:id', ComentarioController.delete);

export default router;
