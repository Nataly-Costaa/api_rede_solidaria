import pool from '../config/db.js';
import bcrypt from 'bcrypt';

export const listarUsuarios = async ({ page = 1, limit = 10, tipo }) => {
    const offset = (page - 1) * limit;

    let query = `
        SELECT id, nome, email, tipo, ponto_id
        FROM usuarios
    `;

    const values = [];

    if (tipo) {
        values.push(tipo);
        query += ` WHERE tipo = $${values.length}`;
    }

    values.push(limit);
    values.push(offset);

    query += ` ORDER BY id DESC LIMIT $${values.length - 1} OFFSET $${values.length}`;

    const result = await pool.query(query, values);

    return result.rows;
};

export const criarUsuario = async ({ nome, email, senha, tipo, ponto_id }) => {
    try {
        const senhaHash = await bcrypt.hash(senha, 10);

        const result = await pool.query(`
            INSERT INTO usuarios (nome, email, senha, tipo, ponto_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, nome, email, tipo, ponto_id
        `, [nome, email, senhaHash, tipo, ponto_id]);

        return result.rows[0];

    } catch (error) {
        if (error.code === '23505') {
            throw new Error('Email já cadastrado');
        }
        throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
};

export const atualizarUsuario = async (id, dados) => {
    try {
        const { nome, email, senha, tipo, ponto_id } = dados;

        let senhaHash = null;

        if (senha) {
            const bcrypt = await import('bcrypt');
            senhaHash = await bcrypt.default.hash(senha, 10);
        }

        const result = await pool.query(`
            UPDATE usuarios
            SET
                nome = COALESCE($1, nome),
                email = COALESCE($2, email),
                senha = COALESCE($3, senha),
                tipo = COALESCE($4, tipo),
                ponto_id = COALESCE($5, ponto_id)
            WHERE id = $6
            RETURNING id, nome, email, tipo, ponto_id
        `, [nome, email, senhaHash, tipo, ponto_id, id]);

        if (result.rowCount === 0) {
            throw new Error('Usuário não encontrado');
        }

        return result.rows[0];

    } catch (error) {
        if (error.code === '23505') {
            throw new Error('Email já está em uso');
        }
        throw new Error(`Erro ao atualizar usuário: ${error.message}`);
    }
};

export const deletarUsuario = async (id) => {
    try {
        const result = await pool.query(
            `DELETE FROM usuarios WHERE id = $1 RETURNING id`,
            [id]
        );

        if (result.rowCount === 0) {
            throw new Error('Usuário não encontrado');
        }

        return result.rows[0];

    } catch (error) {
        throw new Error(`Erro ao deletar usuário: ${error.message}`);
    }
};