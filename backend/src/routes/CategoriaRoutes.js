import express from 'express';
import CategoriaController from '../controllers/CategoriaController.js';

const router = express.Router();

router.get('/', CategoriaController.getAll);
router.post('/', CategoriaController.create);
router.get('/:id', CategoriaController.getById);
router.put('/:id', CategoriaController.update);
router.delete('/:id', CategoriaController.delete);

export default router;
