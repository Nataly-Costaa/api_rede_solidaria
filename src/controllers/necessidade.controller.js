import { listarNecessidadesPorPonto, criarNecessidade } from "../services/necessidade.service.js";

export const getNecessidadesPorPonto = async (req, res) => {
    try {
        const ponto_id = Number(req.params.id);

        if (isNaN(ponto_id)) {
            return res.status(400).json({
                status: 'error',
                message: 'ID inválido'
            });
        }

        if (req.usuario.ponto_id !== ponto_id) {
            return res.status(403).json({
                status: 'error',
                message: 'Você só pode visualizar seu próprio ponto'
            });
        }

        const necessidades = await listarNecessidadesPorPonto(ponto_id);

        return res.json({
            status: 'success',
            data: necessidades
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

export const postNecessidade = async (req, res) => {
    try {
        const { ponto_id, item_id, quantidade_necessaria } = req.body;

        if (
            ponto_id === undefined ||
            item_id === undefined ||
            quantidade_necessaria === undefined
        ) {
            return res.status(400).json({
                status: 'error',
                message: 'Todos os campos são obrigatórios'
            });
        }

        const pontoIdNum = Number(ponto_id);
        const itemIdNum = Number(item_id);
        const quantidadeNum = Number(quantidade_necessaria);

        if (
            isNaN(pontoIdNum) ||
            isNaN(itemIdNum) ||
            isNaN(quantidadeNum)
        ) {
            return res.status(400).json({
                status: 'error',
                message: 'Os campos devem ser números válidos'
            });
        }

        if (quantidadeNum <= 0) {
            return res.status(400).json({
                status: 'error',
                message: 'A quantidade necessária deve ser maior que zero'
            });
        }

        const novaNecessidade = await criarNecessidade({ 
            ponto_id: pontoIdNum,
            item_id: itemIdNum,
            quantidade_necessaria: quantidadeNum
        });

        return res.status(201).json({
            status: 'success',
            data: novaNecessidade
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};