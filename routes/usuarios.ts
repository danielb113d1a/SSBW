import express from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/prisma.client.ts';
import logger from '../logger.ts';

const router = express.Router();
const secret = process.env.SECRET_KEY || 'default-secret-fallback';

router.get('/login', (req, res) => {
    res.render('login.njk', { error: false });
});

router.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const contraseña = req.body.contraseña;
        
        const usuario = await prisma.usuario.autentifica(email, contraseña);
        
        const token = jwt.sign({
            usuario: usuario.nombre,
            admin: usuario.admin
        }, secret, { expiresIn: '1d' });
        
        const isProd = process.env.NODE_ENV === 'production';
        res.cookie("access_token", token, { httpOnly: true, secure: isProd });
        
        res.redirect('/');
    } catch (e: any) {
        logger.error(`Error en login: ${e.message}`);
        res.render('login.njk', { error: true });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie("access_token");
    res.redirect('/');
});

export default router;
