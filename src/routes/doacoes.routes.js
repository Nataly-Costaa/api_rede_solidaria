import express from 'express';
import { getDoacoes, postDoacao } from '../controllers/doacoes.controller.js';
import { autenticar, autorizar } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/doacoes', getDoacoes);
router.post(
  '/doacoes',
  autenticar,
  autorizar('voluntario', 'coordenador'),
  postDoacao
);

export default router;