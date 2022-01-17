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
  await page.goto(config.siteURL, { waitUntil: 'networkidle2' });
  await page.waitFor(5000);

  const modalWindow = await page.$x('//*[@id="ajax-form-clean"]');
  if (modalWindow) {
    const [closeButton] = await page.$x(
      '//*[@id="ajax-form-clean"]/div/div[2]/a'
    );
    closeButton.click();
  }

  const [logInButton] = await page.$x(
    '/html/body/header/div/div/div[5]/div[3]'
  );
  logInButton.click();

  const [entryButton] = await page.$x('/html/body/div[5]/div/div/div[2]/a[1]');
  await entryButton.evaluate((button) => button.click());

  await page.evaluate((email, password) => {
    const emailInput = document.querySelectorAll('#email');
    emailInput[1].value = email;

    const passwordInput = document.querySelector('#password');
    passwordInput.value = password;

    const submitButton = document.querySelector('#login-form > div > div.content-center-form__submit > button');
    submitButton.click();
  }, config.email, config.password);
}

export { runParser };
