import express from 'express';
import prisma from '../prisma/prisma.client.ts';
import logger from '../logger.ts';

const router = express.Router();

// GET /carrito: Muestra el resumen del carrito
router.get('/', async (req, res) => {
    try {
        const s = req.session as any;
        const itemsEnCarrito = s.carrito || [];
        
        if (itemsEnCarrito.length === 0) {
            return res.render('carrito.njk', { items: [], total: 0 });
        }
        
        // Obtener los detalles de los productos desde la DB
        const ids = itemsEnCarrito.map((i: any) => i.id);
        const productosDB = await prisma.producto.findMany({
            where: { id: { in: ids } }
        });
        
        // Cruzar datos de sesión con datos de DB
        let totalGeneral = 0;
        const itemsProcesados = itemsEnCarrito.map((item: any) => {
            const p = productosDB.find((prod) => prod.id === item.id);
            if (!p) return null;
            
            const subtotal = Number(p.precio) * item.cantidad;
            totalGeneral += subtotal;
            
            return {
                ...item,
                título: p.título,
                precio: p.precio,
                imagen: p.imagen,
                subtotal: subtotal.toFixed(2)
            };
        }).filter((item: any) => item !== null);
        
        res.render('carrito.njk', { 
            items: itemsProcesados, 
            total: totalGeneral.toFixed(2) 
        });
        
    } catch (error: any) {
        logger.error(`Error al cargar el carrito: ${error.message}`);
        res.status(500).send("Error al cargar el carrito");
    }
});

// POST /carrito/eliminar/:id: Elimina un producto del carrito
router.post('/eliminar/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const s = req.session as any;
    
    if (s.carrito) {
        s.carrito = s.carrito.filter((item: any) => item.id !== id);
        
        // Recalcular el total_carrito global
        s.total_carrito = s.carrito.reduce((acc: number, item: any) => acc + item.cantidad, 0);
    }
    
    res.redirect('/carrito');
});

// POST /carrito/vaciar: Vacía todo el carrito
router.post('/vaciar', (req, res) => {
    const s = req.session as any;
    s.carrito = [];
    s.total_carrito = 0;
    res.redirect('/carrito');
});

// POST /carrito/pagar: Finaliza la compra y vacía el carrito
router.post('/pagar', (req, res) => {
    const s = req.session as any;
    s.carrito = [];
    s.total_carrito = 0;
    logger.info(`Compra finalizada con éxito.`);
    res.redirect('/?venda_exitosa=true');
});

export default router;
