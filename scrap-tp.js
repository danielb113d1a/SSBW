import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

// Función para sanitizar el nombre de archivo a partir del título
const sanitizeName = (titulo) => titulo.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.jpg';

// Función delay para no saturar el servidor (tiempo en ms)
const waitForTimeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
    console.log("Iniciando navegador...");
    // Inicializar el navegador
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();

    console.log("Navegando a la lista de productos...");
    await page.goto('https://tiendaprado.com/es/385-impresiones', { waitUntil: 'domcontentloaded' });
    
    // Usar exclusivamente locators de Playwright
    // Seleccionamos los enlaces de la tarjeta de producto, como sugeriste
    const linksLocator = page.locator('.thumbnail-container > a, .thumbnail.product-thumbnail');
    const linksCount = await linksLocator.count();
    
    const productUrls = [];
    for (let i = 0; i < linksCount; i++) {
        const href = await linksLocator.nth(i).getAttribute('href');
        if (href && !productUrls.includes(href)) {
            productUrls.push(href);
        }
    }
    
    console.log(`Se han encontrado ${productUrls.length} enlaces de productos.`);
    const results = [];
    
    // Itera sobre los enlaces
    for (const url of productUrls) {
        console.log(`Entrando en producto: ${url}`);
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        
        // Retardo obligatorio
        await waitForTimeout(2000); 
        
        // Extracción con Locators
        const titleLocator = page.locator('h1[itemprop="name"], .h1, h1').first();
        const title = await titleLocator.count() > 0 ? (await titleLocator.textContent()).trim() : 'Sin titulo';
        
        const descLocator = page.locator('.product-description, #description, [itemprop="description"]').first();
        const description = await descLocator.count() > 0 ? (await descLocator.textContent()).trim() : '';
        
        const priceLocator = page.locator('.current-price span, span[itemprop="price"]').first();
        const price = await priceLocator.count() > 0 ? (await priceLocator.textContent()).trim() : '';
        
        // Nombre del archivo sanitizado
        const imageName = sanitizeName(title);
        
        let imageUrl = null;
        const imgLocator = page.locator('.js-modal-product-cover, .product-cover img, [data-image-large-src], img[itemprop="image"]').first();
        if (await imgLocator.count() > 0) {
            imageUrl = await imgLocator.getAttribute('data-image-large-src') || await imgLocator.getAttribute('src');
        }
        
        // Descarga de imagen
        if (imageUrl) {
            try {
                // Aseguramos una URL absoluta y codificada si tiene espacios
                const absoluteImgUrl = new URL(imageUrl, url).href;
                const response = await context.request.get(absoluteImgUrl);
                const buffer = await response.body();
                await fs.writeFile(path.join('imagenes', imageName), buffer);
                console.log(` Imagen guardada -> ${imageName}`);
            } catch (err) {
                console.error(` Error al descargar imagen de ${title}:`, err.message);
            }
        }
        
        // Guardando objeto
        results.push({
            título: title,
            descripción: description,
            texto_precio: price,
            imagen: imageName
        });
    }
    
    console.log("Guardando resultados en json...");
    await fs.writeFile('productos.json', JSON.stringify(results, null, 2), 'utf-8');
    
    await browser.close();
    console.log("Extraordinario! Proceso completado.");
}

run().catch(console.error);
