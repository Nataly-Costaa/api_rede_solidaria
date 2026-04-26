import express from 'express';
import { getNecessidadesPorPonto, postNecessidade } from '../controllers/necessidade.controller.js';
import { autenticar, autorizar } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get(
  '/necessidades/:id',
  autenticar,
  autorizar('coordenador'),
  getNecessidadesPorPonto
);

router.post(
  '/necessidade',
  autenticar,
  autorizar('coordenador'),
  postNecessidade
);

export default router;