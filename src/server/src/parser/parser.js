import puppeteer from 'puppeteer';
import config from './config.js';

let browser = null;
let page = null;

async function runParser() {
  try {
    browser = await puppeteer.launch({
      headless: false, // false: enables one to view the Chrome instance in action
      defaultViewport: null, // (optional) useful only in non-headless mode
    });

    page = await browser.newPage();
    logIn();
  } catch {
    console.log('Произошла ошибка запуска парсера');
    await browser.close();
  }
}

async function logIn() {
  await page.goto(config.logInURL, { waitUntil: 'networkidle2' });

  await page.evaluate((email, password) => {
    const emailInput = document.querySelector('#email');
    emailInput.value = email;

    const passwordInput = document.querySelector('#password');
    passwordInput.value = password;

    const submitButton = document.querySelector('#login-form > div > div.content-center-form__submit > button');
    submitButton.click();
  }, config.email, config.password);
}

export { runParser };
