import jwt from 'jsonwebtoken';

export const autenticar = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            status: 'error',
            message: 'Token não fornecido'
        });
    }

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 'error',
            message: 'Formato de token inválido'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET não configurado');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.usuario = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            status: 'error',
            message: 'Token inválido'
        });
    }
};

export const autorizar = (...tiposPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({
                status: 'error',
                message: 'Usuário não autenticado'
            });
        }

        if (!tiposPermitidos.includes(req.usuario.tipo)) {
            return res.status(403).json({
                status: 'error',
                message: 'Acesso negado'
            });
        }

        next();
    };
};