import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://tiendaprado.com/es/impresiones/285-cartel-el-jardin-de-las-delicias--8436045012968.html', { waitUntil: 'domcontentloaded' });
    
    // Check multiple image locators
    const tryLocators = [
        '.js-qv-product-cover', '#bigpic', 'img[itemprop="image"]', 
        '.product-cover img', '#product-modal img'
    ];
    
    for (const loc of tryLocators) {
        const url = await page.locator(loc).first().getAttribute('src').catch(() => null);
        console.log(`Locator "${loc}": ${url}`);
    }
    
    await browser.close();
})();
