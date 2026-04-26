import pool from '../config/db.js';

export const listarNecessidadesPorPonto = async (ponto_id) => {
   try {
        const result = await pool.query(`
                WITH dados AS (
                SELECT
                    p.id AS ponto_id,
                    p.nome AS ponto,
                    i.id AS item_id,
                    i.nome AS item,
                    n.quantidade_necessaria,
                    COALESCE(SUM(d.quantidade), 0) AS total_recebido

                FROM necessidades n
                JOIN pontos_coleta p ON n.ponto_id = p.id
                JOIN itens i ON n.item_id = i.id

                LEFT JOIN doacoes d 
                    ON d.item_id = n.item_id 
                    AND d.ponto_id = n.ponto_id

                WHERE n.ponto_id = $1

                GROUP BY
                    p.id, p.nome,
                    i.id, i.nome,
                    n.quantidade_necessaria
            ),

            calculado AS (
                SELECT
                    *,
                    quantidade_necessaria - total_recebido AS quantidade_faltante,

                    CASE 
                        WHEN quantidade_necessaria = 0 THEN 0
                        ELSE ROUND((total_recebido::decimal / quantidade_necessaria) * 100, 2)
                    END AS percentual_atendido
                FROM dados
            )

            SELECT
                ponto,
                item,
                quantidade_necessaria,
                total_recebido,
                quantidade_faltante,
                percentual_atendido,

                CASE 
                    WHEN quantidade_necessaria = 0 THEN 'sem necessidade'
                    WHEN percentual_atendido <= 40 THEN 'urgente'
                    WHEN percentual_atendido <= 80 THEN 'moderado'
                    ELSE 'suficiente'
                END AS status

            FROM calculado

            ORDER BY quantidade_faltante DESC;
        `, [ponto_id]);
        return result.rows;
    } catch (error) {
        throw new Error(`Erro ao buscar necessidades do ponto: ${error.message}`);
    }
}

export const criarNecessidade = async ({ ponto_id, item_id, quantidade_necessaria }) => {
    try {
        const result = await pool.query(`
            INSERT INTO necessidades (ponto_id, item_id, quantidade_necessaria)
            VALUES ($1, $2, $3)
            RETURNING *
        `, [ponto_id, item_id, quantidade_necessaria]);

        return result.rows[0];

    } catch (error) {
        if (error.code === '23505') {
            throw new Error('Necessidade já existe para esse ponto e item');
        }
        throw new Error(`Erro ao criar necessidade: ${error.message}`);
    }
};