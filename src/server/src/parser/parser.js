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
    await logIn();
    await closeModalWindow();
  } catch {
    console.log('Произошла ошибка запуска парсера');
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
  await page.goto(url, { waitUntil: 'networkidle2' });
  await page.waitForSelector('#viewer__bar__pages-scale > span:nth-child(3)')
  // const pagesCount = await page.$eval(
  //   '#viewer__bar__pages-scale > span:nth-child(3)',
  //   (elem) => parseInt(elem.innerHTML.substring(2), 10)
  // );

  // for await (let pageNumber of [...Array(pagesCount).keys()]) {
  //   // await page.evaluate((pageNumber) => {
  //   //   console.log(pageNumber);
  //   //   // const currentPage = document.getElementById(`#page_${pageNumber}`);
  //   //   // currentPage.ScrollIntoView();
  //   // });
  // }
}

export { runParser };
