import express from 'express';
import prisma from '../prisma/prisma.client.ts';
import logger from '../logger.ts';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const cards = await prisma.producto.findMany({
            select: {
                id: true,
                título: true,
                precio: true,
                imagen: true
                // Omitimos la descripción en la portada para hacerla más ligera
            }
        });
        
        const venda_exitosa = req.query.venda_exitosa === 'true';
        res.render('portada.njk', { cards, venda_exitosa });
    } catch (error) {
        console.error("Error en la portada:", error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/producto/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const producto = await prisma.producto.findUnique({
            where: { id }
        });
        
        if (!producto) {
            return res.status(404).send('Producto no encontrado');
        }
        
        res.render('detalle.njk', { producto });
    } catch (error) {
        console.error("Error al obtener detalle:", error);
        res.status(500).send('Error al obtener el producto');
    }
});

router.get('/buscar', async (req, res) => {
    try {
        const query = (req.query.busqueda as string) || '';
        
        const cards = await prisma.producto.findMany({
            where: {
                OR: [
                    { título: { contains: query, mode: 'insensitive' } },
                    { descripción: { contains: query, mode: 'insensitive' } }
                ]
            },
            select: {
                id: true,
                título: true,
                precio: true,
                imagen: true
            }
        });
        
        res.render('portada.njk', { cards, busqueda: query });
    } catch (error) {
        logger.error(`Error en búsqueda: ${(error as Error).message}`);
        res.status(500).send('Error en la búsqueda');
    }
});

router.post('/al-carrito/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const cantidad = parseInt(req.body.cantidad);
    
    logger.debug(`Al carrito de ${id} ${cantidad} unidad(es)`);
    
    if (cantidad > 0) {
        const s = req.session as any;
        if (!s.carrito) {
            s.carrito = [];
        }
        
        const index = s.carrito.findIndex((i: any) => i.id === id);
        if (index > -1) {
            s.carrito[index].cantidad += cantidad;
        } else {
            s.carrito.push({ id, cantidad });
        }
        
        let total = 0;
        for (const item of s.carrito) {
            total += item.cantidad;
        }
        
        s.total_carrito = total;
        res.locals.total_carrito = total;
        
        logger.debug(`Total carrito actualizado: ${res.locals.total_carrito}`);
    }
    
    res.redirect(`/producto/${id}`);
});

export default router;
