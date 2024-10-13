// preRenderServer.js
const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Enable CORS to allow your friend's app to fetch pre-rendered content from your server
app.use(cors());

// Endpoint to render the page
app.get('/render', async (req, res) => {
  const url = req.query.url;
  console.log(`Received request to render: ${url}`);

  if (!url) {
    return res.status(400).send('Missing URL parameter');
  }

  try {
    // Launch headless browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the user agent to mimic a bot
    await page.setUserAgent('Googlebot/2.1 (+http://www.google.com/bot.html)');

    // Navigate to the URL
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Get the HTML content
    const html = await page.content();

    // Close the browser
    await browser.close();

    // Send the HTML content
    res.send(html);
  } catch (error) {
    console.error('Error rendering page:', error);
    res.status(500).send('Error rendering page');
  }
});

// Keep the service alive by sending a request every 14 minutes
setInterval(async () => {
  try {
    const response = await fetch(`https://skin-colour-leggings.onrender.com/render?url=https://example.com`);
    console.log(`Keep-alive request sent, response status: ${response.status}`);
  } catch (error) {
    console.error('Error sending keep-alive request:', error);
  }
}, 14 * 60 * 1000); // 14 minutes in milliseconds

// Start the server
app.listen(PORT, () => {
  console.log(`Pre-rendering server is running on port ${PORT}`);
});
