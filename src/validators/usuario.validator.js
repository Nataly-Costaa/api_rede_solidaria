import { z } from 'zod';

export const criarUsuarioSchema = z.object({
    nome: z.string().min(3),
    email: z.string().email(),
    senha: z.string().min(6),
    tipo: z.enum(['admin', 'coordenador', 'voluntario']),
    ponto_id: z.number().optional()
});