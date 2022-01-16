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
  await page.goto(config.siteURL);
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

  page.waitForSelector('#email')
  const email = await page.$('#email');
  // email.click();
  // console.dir(email);
  // await page.$eval('#email', (el) => (el.value = '548654'));

  // await page.click(
  //   '#login-form > div > div.content-center-form__submit > button'
  // );


  // page.waitForSelector('#email').then(() => page.focus('#email'));

  // // await page.waitForSelector('#email', { visible: true });
  // await page.focus('#email');

  // await page.waitForXPath('//*[@id="email"]', { visible: true });
  // const [email] = await page.$x('//*[@id="email"]');
  // if (email) {
  //   console.log(email)
  //   await email.evaluate((email) => email.click());
  // }
  // await page.focus('//*[@id="email"]');
  // await page.keyboard.type('test54');

  // const [email] = await page.$x('//*[@id="password"]');
  // await email.evaluate((email) => email.click());
  // await email.type('Blah');

  // await page.focus('#email');
  // await page.keyboard.type('test54');
  // await page.evaluate(() => {
  //   const email = document.querySelector('#email');
  //   email.value = 'test@example.com';
  // });

  // await page.$eval(
  //   '#email',
  //   (el) => (el.value = '548654')
  // );
}

export { runParser };
