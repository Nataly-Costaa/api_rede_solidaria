import pool from '../config/db.js';
import bcrypt from 'bcrypt';

export const loginUsuario = async (email, senha) => {
    try {
        const result = await pool.query(
            `SELECT * FROM usuarios WHERE email = $1`,
            [email]
        );

        const usuario = result.rows[0];

        if (!usuario) {
            throw new Error('Credenciais inválidas');
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            throw new Error('Credenciais inválidas');
        }

        return {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            tipo: usuario.tipo,
            ponto_id: usuario.ponto_id
        };

    } catch (error) {
        throw new Error(`Erro no login: ${error.message}`);
    }
};