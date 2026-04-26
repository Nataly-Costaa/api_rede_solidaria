import express from 'express';
import { getPontos, postPonto } from '../controllers/ponto.controller.js';
import { autenticar, autorizar } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/pontos', autenticar, autorizar('admin'), postPonto);
router.get('/pontos', autenticar, autorizar('admin'), getPontos);

export default router;