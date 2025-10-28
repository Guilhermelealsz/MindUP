import express from 'express';
import CategoriaController from '../controllers/CategoriaController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', CategoriaController.getAll);
router.post('/', auth, CategoriaController.create);
router.get('/:id', CategoriaController.getById);
router.put('/:id', auth, CategoriaController.update);
router.delete('/:id', auth, CategoriaController.delete);

export default router;
