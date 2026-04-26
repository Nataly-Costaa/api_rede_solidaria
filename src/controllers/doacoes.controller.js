import { listarDoacoes, criarDoacao } from '../services/doacoes.service.js';

export const getDoacoes = async (req, res) => {
    try {
        const dados = await listarDoacoes();

        res.json({
            status: 'success',
            total: dados.length,
            data: dados
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

export const postDoacao = async (req, res) => {
    try {
        const { item_id, ponto_id, quantidade } = req.body;

        const usuario_id = req.usuario.id;
        const tipo = req.usuario.tipo;

        if (
            item_id === undefined ||
            ponto_id === undefined ||
            quantidade === undefined
        ) {
            return res.status(400).json({
                status: 'error',
                message: 'Todos os campos são obrigatórios'
            });
        }

        if (quantidade <= 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Quantidade deve ser maior que zero'
            });
        }

        // 🔐 regra do coordenador
        if (
            tipo === 'coordenador' &&
            req.usuario.ponto_id !== ponto_id
        ) {
            return res.status(403).json({
                status: 'error',
                message: 'Você só pode registrar doações no seu ponto'
            });
        }

        const novaDoacao = await criarDoacao({
            item_id,
            ponto_id,
            usuario_id,
            quantidade
        });

        return res.status(201).json({
            status: 'success',
            data: novaDoacao
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};