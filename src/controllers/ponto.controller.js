import { listarPontos, criarPonto } from "../services/ponto.service.js";

export const getPontos = async (req, res) => {
    try {
        const dados = await listarPontos();
   
        res.status(200).json({
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

export const postPonto = async (req, res) => {
    try {
        const { nome, endereco } = req.body;

        if (!nome || nome.trim() === '') {
            return res.status(400).json({
                status: 'error',
                message: 'Nome é obrigatório'
            });
        }

        if (!endereco || endereco.trim() === '') {
            return res.status(400).json({
                status: 'error',
                message: 'Endereço é obrigatório'
            });
        }

        const novoPonto = await criarPonto({
            nome,
            endereco
        });

        return res.status(201).json({
            status: 'success',
            data: novoPonto
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}