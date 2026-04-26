import express from 'express';
import { getUsuarios,postUsuario, putUsuario, deleteUsuario } from '../controllers/usuario.controller.js';
import { autenticar, autorizar } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { criarUsuarioSchema } from '../validators/usuario.validator.js';

const router = express.Router();

router.get('/usuarios', autenticar, autorizar('admin'), getUsuarios);
router.post(
  '/usuarios',
  autenticar,
  autorizar('admin'),
  validate(criarUsuarioSchema),
  postUsuario
);
router.put('/usuarios/:id', autenticar, putUsuario);
router.delete('/usuarios/:id', autenticar, autorizar('admin'), deleteUsuario);

export default router;