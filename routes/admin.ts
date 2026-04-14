import express from 'express';
import prisma from '../prisma/prisma.client.ts';
import logger from '../logger.ts';

const router = express.Router();

// Middleware protector: Requiere que req.admin sea true en la sesión (establecido por nuestro verificador JWT global)
router.use((req, res, next) => {
    if (!(req as any).admin) {
        return res.status(403).send("Acceso Denegado. Exclusivo para administradores.");
    }
    next();
});

// GET /admin/nuevo: Muestra el formulario vacío para crear
router.get('/nuevo', (req, res) => {
    res.render('admin-form.njk', { action: '/admin/nuevo', titulo_pagina: 'Añadir Nueva Obra' });
});

// POST /admin/nuevo: Recibe los datos y persiste
router.post('/nuevo', async (req, res) => {
    try {
        const { título, descripción, precio, imagen } = req.body;
        await prisma.producto.create({
            data: { 
                título: título || "Obra sin título", 
                descripción: descripción || "",
                precio: parseFloat(precio) || 0,
                imagen: imagen || "default.jpg"
            }
        });
        logger.info(`Admin ${(req as any).usuario} creó un producto: ${título}`);
        res.redirect('/');
    } catch (e: any) {
        logger.error(`Error en Admin -> Crear Producto: ${e.message}`);
        res.status(500).send("Ocurrió un error en el servidor al intentar crear el producto.");
    }
});

// GET /admin/editar/:id: Muestra el formulario con los datos pre-rellenados
router.get('/editar/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const producto = await prisma.producto.findUnique({ where: { id }});
        
        if (!producto) {
            return res.status(404).send("Obra no encontrada en el inventario.");
        }
        
        res.render('admin-form.njk', { action: `/admin/editar/${id}`, titulo_pagina: 'Editar Obra Maestra', producto });
    } catch (e) {
        res.status(500).send("Ocurrió un error interno recuperando datos del producto.");
    }
});

// POST /admin/editar/:id: Guarda la modificación en base de datos
router.post('/editar/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { título, descripción, precio, imagen } = req.body;
        
        await prisma.producto.update({
            where: { id },
            data: {
                título, descripción, precio: parseFloat(precio), imagen
            }
        });
        logger.info(`Admin ${(req as any).usuario} actualizó el producto id: ${id}`);
        res.redirect('/');
    } catch (e) {
        res.status(500).send("Error del sistema guardando las actualizaciones.");
    }
});

// POST /admin/borrar/:id: Elimina directamente el item de la DB
router.post('/borrar/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await prisma.producto.delete({ where: { id }});
        logger.info(`Admin ${(req as any).usuario} borró permanentemente el producto id: ${id}`);
        res.redirect('/');
    } catch (e) {
        res.status(500).send("El borrado estructural falló.");
    }
});

export default router;
