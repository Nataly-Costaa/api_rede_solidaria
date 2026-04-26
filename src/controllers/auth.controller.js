import jwt from 'jsonwebtoken';
import { loginUsuario } from '../services/auth.service.js';

export const login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                status: 'error',
                message: 'Email e senha são obrigatórios'
            });
        }

        const usuario = await loginUsuario(email, senha);

        const token = jwt.sign(
            {
                id: usuario.id,
                tipo: usuario.tipo,
                ponto_id: usuario.ponto_id
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        return res.json({
            status: 'success',
            token
        });

    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: error.message
        });
    }
};