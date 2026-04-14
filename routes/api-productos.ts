import express from 'express';
import prisma from '../prisma/prisma.client.ts';
import logger from '../logger.ts';

const router = express.Router();

// GET /api/productos
router.get('/', async (req, res) => {
    try {
        const { desde, hasta, ordenacion } = req.query;
        let pOptions: any = {};

        // Manejo de la paginación
        if (desde !== undefined && hasta !== undefined) {
            const skip = parseInt(desde as string);
            const limit = parseInt(hasta as string);
            const take = limit - skip;
            if (!isNaN(skip) && !isNaN(take) && take > 0) {
                pOptions.skip = skip;
                pOptions.take = take;
            }
        } else if (desde !== undefined) {
            const skip = parseInt(desde as string);
            if (!isNaN(skip)) pOptions.skip = skip;
        }

        // Manejo de la ordenación
        if (ordenacion) {
            const ordParam = String(ordenacion);
            if (ordParam === 'asc' || ordParam === 'desc') {
                pOptions.orderBy = { id: ordParam };
            } else if (ordParam.includes('_')) {
                // Soportar "precio_asc", "titulo_desc"
                const [field, dir] = ordParam.split('_');
                pOptions.orderBy = { [field]: dir };
            } else {
                 pOptions.orderBy = { id: 'asc' };
            }
        }

        const productos = await prisma.producto.findMany(pOptions);
        res.json(productos);
    } catch (e: any) {
        logger.error(`Error GET /api/productos: ${e.message}`);
        res.status(500).json({ error: 'Error del servidor obteniendo productos' });
    }
});

// GET /api/productos/:id
router.get('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const producto = await prisma.producto.findUnique({ where: { id } });
        
        if (!producto) {
            res.status(404).json({ error: 'Producto no encontrado' });
            return;
        }
        res.json(producto);
    } catch (e: any) {
        logger.error(`Error GET /api/productos/:id : ${e.message}`);
        res.status(500).json({ error: 'Error del servidor obteniendo el producto' });
    }
});

// POST /api/productos
router.post('/', async (req, res) => {
    try {
        const { título, descripción, precio, imagen } = req.body;
        
        const producto = await prisma.producto.create({
            data: { 
                título: título || "Sin título", 
                descripción: descripción || "", 
                precio: parseFloat(precio) || 0, 
                imagen: imagen || "default.jpg" 
            }
        });
        res.status(201).json(producto);
    } catch (e: any) {
        logger.error(`Error POST /api/productos: ${e.message}`);
        res.status(500).json({ error: 'Error agregando nuevo producto' });
    }
});

// PUT /api/productos/:id
router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { título, descripción, precio, imagen } = req.body;
        
        const data: any = {};
        if (título !== undefined) data.título = título;
        if (descripción !== undefined) data.descripción = descripción;
        if (precio !== undefined) data.precio = parseFloat(precio);
        if (imagen !== undefined) data.imagen = imagen;

        const producto = await prisma.producto.update({
            where: { id },
            data
        });
        res.json(producto);
    } catch (e: any) {
        logger.error(`Error PUT /api/productos/${req.params.id} : ${e.message}`);
        if(e.code === 'P2025') {
            res.status(404).json({ error: 'Producto no encontrado para actualizar' });
            return;
        }
        res.status(500).json({ error: 'Error actualizando producto' });
    }
});

// DELETE /api/productos/:id
router.delete('/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await prisma.producto.delete({ where: { id } });
        res.json({ success: true, message: `Producto ${id} eliminado` });
    } catch (e: any) {
        logger.error(`Error DELETE /api/productos/${req.params.id} : ${e.message}`);
        if(e.code === 'P2025') {
            res.status(404).json({ error: 'Producto no encontrado para borrar' });
            return;
        }
        res.status(500).json({ error: 'Error eliminando producto' });
    }
});

export default router;
