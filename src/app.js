import express from 'express';
import cors from 'cors';
import doacoesRoutes from './routes/doacoes.routes.js';
import pontoRoutes from './routes/ponto.routes.js';
import necessidadeRoutes from './routes/necessidade.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { logger } from './middleware/logger.middleware.js';

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://rede-solidaria-nine.vercel.app/'
  ],
  credentials: true
}));

const PORT = process.env.PORT || 3000;

app.use(logger);
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', doacoesRoutes);
app.use('/api', pontoRoutes);
app.use('/api', necessidadeRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando 🚀');
});

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Rota não encontrada'
  });
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});