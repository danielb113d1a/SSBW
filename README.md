# 🎨 E-Commerce Museo Nacional del Prado (MPA)

**Alumno:** Daniel Pérez Núñez  
**Asignatura:** Sistemas Software Basados en Web  
**Curso:** 2025/2026

---

Una aplicación web multipágina (MPA) premium construida con **Node.js**, **Express** y **Nunjucks**, utilizando **Prisma ORM** con una base de datos **PostgreSQL** sobre Docker. El proyecto incluye un sistema de Web Scraping para la obtención de datos artísticos reales.

## 🚀 Características Principales

- **Web Scraping Automatizado**: Extracción de catálogo real desde Tienda Prado mediante **Playwright**.
- **Arquitectura MVC**: Separación clara de Rutas, Controladores y Plantillas dinámicas.
- **Base de Datos Robusta**: Persistencia de datos con **PostgreSQL** (Docker) y **Prisma ORM**.
- **Autentificación Segura**: Sistema de usuarios y administrador con **JWT (JSON Web Tokens)** y hashing de contraseñas con **Bcrypt**.
- **Carrito de Compra Interactivo**: Gestión de pedidos en tiempo real con persistencia en sesión.
- **Panel de Administración**: Interfaz gráfica protegida para el mantenimiento del catálogo (CRUD).
- **API RESTful**: Endpoints JSON documentados para integraciones externas.
- **Diseño Premium**: Interfaz moderna basada en **Bootstrap 5** con estética de Glassmorphism.

## 🛠️ Stack Tecnológico

- **Runtime**: Node.js (v23+)
- **Lenguaje**: TypeScript
- **Framework**: Express.js
- **Motor de Plantillas**: Nunjucks
- **ORM**: Prisma (v7+)
- **Base de Datos**: PostgreSQL (v18 Alpine)
- **Seguridad**: JWT, Cookie-parser, Bcrypt
- **Logs**: Winston
- **Scraping**: Playwright

---

## 🔧 Instalación y Puesta en Marcha

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/SSBW.git
cd SSBW
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz (puedes basarte en el ejemplo incluido o usar estos valores por defecto):
```env
PORT=3000
DATABASE_URL="postgresql://yo:una_clave_muy_segura_123@localhost:5433/tienda?schema=public"
SECRET_KEY="tu_secret_key_aqui"
```

### 4. Levantar la Base de Datos (Docker)
Asegúrate de tener Docker instalado y ejecutando:
```bash
docker compose up -d
```

### 5. Preparar la Base de Datos
Ejecuta las migraciones y puebla la base de datos con los datos scrapeados:
```bash
npx prisma migrate dev --name init
node --env-file=.env seed.ts
```

### 6. Ejecutar en Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

---

## 🧪 Pruebas de la API
Se incluye un archivo `test-api.http` compatible con la extensión **REST Client** de VSCode para probar todos los endpoints de la API productos.

## 👤 Usuarios de Prueba
- **Administrador**: `admin@tienda.local` / `admin_password123`
- **Cliente**: `cliente@tienda.local` / `cliente_password123`

---

## ✒️ Autor
Proyecto desarrollado como implementación premium de una aplicación Node.js escalable.
