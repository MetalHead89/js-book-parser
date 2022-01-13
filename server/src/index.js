const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 5000;

app.get('/start-parsing', (req, res) => {
  console.log('parsing started');
  scrap();
});

app.listen(port, () => {
  console.log(`Express server has been started on http://localhost:${port}`);
});

async function scrap() {
  const url = 'https://vk.com/';

  const browser = await puppeteer.launch({
    headless: true, // false: enables one to view the Chrome instance in action
    defaultViewport: null, // (optional) useful only in non-headless mode
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  const content = await page.content();

  console.log(content);
}
