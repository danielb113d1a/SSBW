import prisma from './prisma/prisma.client.ts';

async function main() {
    try {
        console.log("Registrando usuarios de prueba...");
        
        await prisma.usuario.create({
            data: {
                email: 'admin@tienda.local',
                nombre: 'Administrador',
                contraseña: 'admin_password123',
                admin: true
            }
        });
        
        await prisma.usuario.create({
            data: {
                email: 'cliente@tienda.local',
                nombre: 'Cliente Especial',
                contraseña: 'cliente_password123',
                admin: false
            }
        });
        
        console.log("Usuarios registrados exitosamente.");
        
        console.log("\nProbando validación 'autentifica'...");
        const valid = await prisma.usuario.autentifica('admin@tienda.local', 'admin_password123');
        console.log("Resultado de validación:", valid);
        
    } catch(e) {
        console.error("Error en el script:", (e as Error).message);
    } finally {
        process.exit(0);
    }
}
main();
