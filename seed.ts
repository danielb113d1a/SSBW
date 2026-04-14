import prisma from './prisma/prisma.client.ts';
import productos from './productos.json' with { type: 'json' };

// Define the interface to match json
interface ProductoJSON {
    título: string;
    descripción: string;
    texto_precio: string;
    imagen: string;
}

type Productos = ProductoJSON[];

async function Guadar_en_DB(productos: Productos): Promise<void> {
    for (const producto of productos) {
        // Formatear precio ("30,00 €" -> 30.00)
        const precio = Number(producto.texto_precio.slice(0, -2).replace(',', '.'));
        
        try {
            await prisma.producto.create({
                data: {
                    título: producto.título,
                    descripción: producto.descripción,
                    precio: precio,
                    imagen: producto.imagen
                }
            });
            console.log(`Producto "${producto.título}" insertado.`);
        } catch (error) {
            console.error(`Error al insertar "${producto.título}":`, error);
        }
    }
}

async function run() {
    console.log("Iniciando guardado en Base de Datos...");
    await Guadar_en_DB(productos as Productos);
    
    // Consulta comprobatoria: buscar productos cuya descripción empiece por 'lámina', ordenados por precio
    console.log("\nEjecutando consulta de comprobación (descripción contiene 'Este cartel', orden precio ascendente):");
    // Modificamos a algo que exista en la desc real porque 'lámina' puede no estar
    const resultados = await prisma.producto.findMany({
        where: {
            descripción: {
                contains: 'cartel',
                mode: 'insensitive'
            }
        },
        orderBy: {
            precio: 'asc'
        }
    });
    
    console.log(resultados);
    
    await prisma.$disconnect();
    console.log("Desconectado correctamente.");
}

run();
