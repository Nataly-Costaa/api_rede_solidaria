import { criarUsuario, listarUsuarios, atualizarUsuario, deletarUsuario } from '../services/usuario.service.js';

export const getUsuarios = async (req, res) => {
    try {
        const { page = 1, limit = 10, tipo } = req.query;

        const usuarios = await listarUsuarios({
            page: Number(page),
            limit: Number(limit),
            tipo
        });

        res.json({
            status: 'success',
            page: Number(page),
            limit: Number(limit),
            data: usuarios
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const postUsuario = async (req, res) => {
    try {
        const { nome, email, senha, tipo, ponto_id } = req.body;

        if (!nome || !email || !senha || !tipo) {
            return res.status(400).json({
                status: 'error',
                message: 'Campos obrigatórios: nome, email, senha, tipo'
            });
        }

        const tiposValidos = ['admin', 'coordenador', 'voluntario'];

        if (!tiposValidos.includes(tipo)) {
            return res.status(400).json({
                status: 'error',
                message: 'Tipo de usuário inválido'
            });
        }

        if (tipo !== 'admin' && !ponto_id) {
            return res.status(400).json({
                status: 'error',
                message: 'Usuários não-admin precisam de ponto_id'
            });
        }

        const novoUsuario = await criarUsuario({
            nome,
            email,
            senha,
            tipo,
            ponto_id: tipo === 'admin' ? null : ponto_id
        });

        return res.status(201).json({
            status: 'success',
            data: novoUsuario
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

export const putUsuario = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const usuarioLogado = req.usuario;

        if (isNaN(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'ID inválido'
            });
        }

        if (
            usuarioLogado.tipo !== 'admin' &&
            usuarioLogado.id !== id
        ) {
            return res.status(403).json({
                status: 'error',
                message: 'Você não pode alterar este usuário'
            });
        }

        const dados = req.body;

        if (usuarioLogado.tipo !== 'admin') {
            delete dados.tipo;
            delete dados.ponto_id;
        }

        const usuarioAtualizado = await atualizarUsuario(id, dados);

        return res.json({
            status: 'success',
            data: usuarioAtualizado
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};

export const deleteUsuario = async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({
                status: 'error',
                message: 'ID inválido'
            });
        }

        await deletarUsuario(id);

        return res.json({
            status: 'success',
            message: 'Usuário deletado com sucesso'
        });

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};