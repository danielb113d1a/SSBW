import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

import bcrypt from 'bcrypt';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const basePrisma = new PrismaClient({ adapter });

const prisma = basePrisma.$extends({
  model: {
    usuario: {
      async autentifica(email: string, contra: string) {
        const u = await basePrisma.usuario.findUnique({ where: { email } });
        if (!u) throw new Error("Credenciales inválidas");
        const valido = await bcrypt.compare(contra, u.contraseña);
        if (!valido) throw new Error("Credenciales inválidas");
        return u;
      }
    }
  },
  query: {
    usuario: {
      async create({ args, query }) {
        if (args.data.contraseña) {
            args.data.contraseña = await bcrypt.hash(args.data.contraseña, 10);
        }
        return query(args);
      }
    }
  }
});

export default prisma;
