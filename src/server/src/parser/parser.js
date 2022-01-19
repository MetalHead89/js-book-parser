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
    await page.setDefaultNavigationTimeout(0);
    await logIn();
    await closeModalWindow();
  } catch (e) {
    console.log(`Произошла ошибка во время запуска: ${e.message}`);
    await browser.close();
  }
}

async function logIn() {
  await page.goto(config.logInURL, { waitUntil: 'networkidle2' });

  await page.evaluate(
    (email, password) => {
      const emailInput = document.querySelector('#email');
      emailInput.value = email;

      const passwordInput = document.querySelector('#password');
      passwordInput.value = password;

      const submitButton = document.querySelector(
        '#login-form > div > div.content-center-form__submit > button'
      );
      submitButton.click();
    },
    config.email,
    config.password
  );

  await page.waitForNavigation();
}

async function closeModalWindow() {
  const modalWindow = await page.$x('//*[@id="ajax-form-clean"]');
  if (modalWindow) {
    await page.evaluate(() => {
      const buttonClose = document.querySelector(
        '#ajax-form-clean > div > div.popup-close-wrapper > a'
      );

      buttonClose.click();
    });
  }

  if (page.url() === 'https://urait.ru/') {
    await saveBook(
      'https://urait.ru/viewer/informacionnye-tehnologii-v-marketinge-489042'
    );
  }
}

async function saveBook(url) {
  await page.goto(
    'https://urait.ru/viewer/informacionnye-tehnologii-v-marketinge-489042#page/1'
  );

  // await page.waitForNavigation();
  //   await page.waitForSelector('#page_5')
  // await page.evaluate(() => {
  //   const el = document.querySelector('#page_5')
  //   el.scrollIntoView();
  // });

  // await page.$eval(
  //   '#viewer__bar__pages-scale > input[type=text]',
  //   (el) => el.click()
  // );

  // await page.focus(pageInput);

  await page.waitForSelector('#viewer__bar__pages-scale > span:nth-child(3)');
  const pagesCount = await page.$eval(
    '#viewer__bar__pages-scale > span:nth-child(3)',
    (elem) => parseInt(elem.innerHTML.substring(2), 10)
  );

  for await (let pageNumber of [...Array(pagesCount).keys()]) {
    const selector = `#page_${pageNumber + 1}`;
    await page.waitForSelector(selector);
    await page.evaluate((selector) => {
      const el = document.querySelector(selector);
      el.scrollIntoView();
    }, selector);
    // console.log(pageNumber);
    // const selector = `#page_${pageNumber}`;
    // await page.waitForSelector(selector);
    // await page.evaluate((pageNumber) => {
    //   const currentPage = document.getElementById(selector);
    //   if (currentPage) {
    //     currentPage.ScrollIntoView();
    //   }
    // }, pageNumber + 1);
  }

  // await page.goto('https://urait.ru/viewer/informacionnye-tehnologii-v-marketinge-489042#page/1', { waitUntil: 'networkidle2' });
  // await page.waitFor('10000');
  // await page.goto('https://urait.ru/viewer/informacionnye-tehnologii-v-marketinge-489042#page/2', { waitUntil: 'networkidle2' });
  // await page.waitFor('10000');
  // await page.goto('#page_3', { waitUntil: 'networkidle2' });
  // await page.waitForSelector('#page_3');
  // await page.goto('#page_4', { waitUntil: 'networkidle2' });

  // await page.waitForSelector(`#page_2`);
  // // await page.$eval(`#page_1`, (e) => {
  // //   // e.ScrollIntoView();
  // // });
  // await page.focus('#page_2');

  // const p = await page.$(`#page_2`);
  // console.log(p);

  // for await (let pageNumber of [...Array(pagesCount).keys()]) {
  //   // console.log(pageNumber);
  //   const selector = `#page_${pageNumber}`;
  //   await page.waitForSelector(selector);
  //   await page.evaluate((pageNumber) => {
  //     const currentPage = document.getElementById(selector);
  //     if (currentPage) {
  //       currentPage.ScrollIntoView();
  //     }
  //   }, pageNumber + 1);
  // }
}

export { runParser };
