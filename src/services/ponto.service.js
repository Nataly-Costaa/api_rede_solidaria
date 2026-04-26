import pool from '../config/db.js';

export const criarPonto = async ({ nome, endereco }) => {
    try {
        const result = await pool.query(`
            INSERT INTO pontos_coleta (nome, endereco)
            VALUES ($1, $2)
            RETURNING *
        `, [nome, endereco]);

        return result.rows[0];

    } catch (error) {
        throw new Error(`Erro ao criar ponto: ${error.message}`);
    }
};

export const listarPontos = async () => {
    try {
        const result = await pool.query(
            `SELECT 
                id, 
                nome, 
                endereco 
            FROM pontos_coleta 
            ORDER BY nome`
        );
        return result.rows;
    } catch (error) {
        throw new Error(`Erro ao listar pontos: ${error.message}`);
    }
}