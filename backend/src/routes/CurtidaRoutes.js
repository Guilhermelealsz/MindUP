import express from 'express';
import CurtidaController from '../controllers/CurtidaController.js';

const router = express.Router();

router.post('/', CurtidaController.like);
router.delete('/:id', CurtidaController.unlike);
router.get('/:id', CurtidaController.getLikes);

export default router;
