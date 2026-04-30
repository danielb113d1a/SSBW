import express from 'express';
import nunjucks from 'nunjucks';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import logger from './logger.ts';
import cors from 'cors';
import fs from 'fs';

// Importamos los enrutadores
import ProductosRouter from './routes/productos.ts';
import UsuariosRouter from './routes/usuarios.ts';
import ApiProductosRouter from './routes/api-productos.ts';
import AdminRouter from './routes/admin.ts';
import CarritoRouter from './routes/carrito.ts';
import ApiCarritoRouter from './routes/api-carrito.ts';

const app = express();
const port = process.env.PORT || 3000;

// Configuración de Nunjucks
nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true // Recarga en vivo de plantillas
});

// Configurar extensión .njk por defecto
app.set('view engine', 'njk');

// Middlewares vitales
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Necesario para POST / PUT en la API JSON
app.use(cookieParser());
app.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: false
}));

// Middleware local: Inyección universal de sesión en las vistas
app.use((req, res, next) => {
    const s = req.session as any;
    res.locals.carrito = s.carrito || [];
    res.locals.total_carrito = s.total_carrito || 0;
    next();
});

// Middleware Global de Autentificación (JWT + Cookies)
app.use((req, res, next) => {
    const token = req.cookies.access_token;
    if (token) {
        try {
            const secret = process.env.SECRET_KEY || 'default-secret-fallback';
            const data = jwt.verify(token, secret) as any;
            (req as any).usuario = data.usuario;
            (req as any).admin = data.admin;
            app.locals.usuario = data.usuario;
            app.locals.admin = data.admin;
            logger.info(`Autentificado ${data.usuario} admin:${data.admin}`);
        } catch (e) {
            app.locals.usuario = undefined;
            app.locals.admin = undefined;
        }
    } else {
        app.locals.usuario = undefined;
        app.locals.admin = undefined;
    }
    next();
});

// Middleware de archivos estáticos (imágenes)
app.use('/public/imagenes', express.static(path.resolve('imagenes')));

app.get('/api/random-image', (req, res) => {
    try {
        const dirPath = path.resolve('imagenes');
        const files = fs.readdirSync(dirPath);
        const images = files.filter(f => f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.jpeg'));
        if (images.length === 0) {
            return res.status(404).json({ error: 'No images found' });
        }
        const randomImage = images[Math.floor(Math.random() * images.length)];
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        res.json({ url: `${baseUrl}/public/imagenes/${randomImage}` });
    } catch (e) {
        res.status(500).json({ error: 'Error reading images' });
    }
});

// Rutas
app.use('/api/productos', ApiProductosRouter);
app.use('/api/carrito', ApiCarritoRouter);
app.use('/admin', AdminRouter);
app.use('/carrito', CarritoRouter);
app.use('/', UsuariosRouter);
app.use('/', ProductosRouter);

app.listen(port, () => {
    logger.info(`[Servidor] Escuchando en http://localhost:${port}`);
});
