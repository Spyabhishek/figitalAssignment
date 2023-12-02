const puppeteer = require('puppeteer');
const fs = require('fs');

// Define a function to scrape product information
const scrapeProducts = async () => {
    // Launch a new browser instance
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the provided URL
    await page.goto('https://books.toscrape.com/catalogue/category/books/young-adult_21/index.html');

    // Use page.evaluate to run JavaScript code within the page context
    const productData = await page.evaluate(() => {
        // Initialize an empty array to store product information
        const products = [];

        // Loop through each product on the page
        document.querySelectorAll('.product_pod').forEach((product) => {
            // Extract product details
            const title = product.querySelector('h3 a').textContent.trim();
            const description = product.querySelector('p').textContent.trim();
            const price = product.querySelector('.price_color').textContent.trim();
            const imageUrl = product.querySelector('img').getAttribute('src');

            // Push the extracted information into the products array
            products.push({
                title,
                description,
                price,
                imageUrl,
            });
        });

        // Return the array of product information
        return products;
    });

    // Close the browser
    await browser.close();

    // Write the extracted data to a JSON file
    fs.writeFileSync('products.json', JSON.stringify(productData, null, 2));
    console.log('Product data has been scraped and saved to products.json');
};


scrapeProducts();
