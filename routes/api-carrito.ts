import express from 'express';
import prisma from '../prisma/prisma.client.ts';
import logger from '../logger.ts';

const router = express.Router();

// GET /api/carrito: Devuelve el carrito actual en formato JSON
router.get('/', async (req, res) => {
    try {
        const s = req.session as any;
        const itemsEnCarrito = s.carrito || [];
        
        if (itemsEnCarrito.length === 0) {
            return res.json({ items: [], total: "0.00" });
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
                id: item.id,
                cantidad: item.cantidad,
                título: p.título,
                precio: p.precio,
                imagen: p.imagen,
                subtotal: subtotal.toFixed(2)
            };
        }).filter((item: any) => item !== null);
        
        res.json({ 
            items: itemsProcesados, 
            total: totalGeneral.toFixed(2) 
        });
        
    } catch (error: any) {
        logger.error(`Error en API carrito GET: ${error.message}`);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// DELETE /api/carrito/:id: API ad hoc para eliminar un producto del carrito sin recargar
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const s = req.session as any;
    
    if (s.carrito) {
        s.carrito = s.carrito.filter((item: any) => item.id !== id);
        
        // Recalcular el total_carrito global
        s.total_carrito = s.carrito.reduce((acc: number, item: any) => acc + item.cantidad, 0);
        
        res.json({ success: true, newTotal: s.total_carrito });
    } else {
        res.status(404).json({ error: "Carrito vacío" });
    }
});

export default router;
