import { jsPDF } from 'jspdf';
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
  await page.goto(`${url}#page/1`);

  await page.waitForSelector('#viewer__bar__pages-scale > span:nth-child(3)');
  const pagesCount = await page.$eval(
    '#viewer__bar__pages-scale > span:nth-child(3)',
    (elem) => parseInt(elem.innerHTML.substring(2), 10)
  );

  // const selector = '#page_1';
  // await page.waitForSelector(selector);
  // await page.evaluate((selector) => {
  //   const el = document.querySelector(selector);
  //   el.scrollIntoView();
  // }, selector);

  // await page.waitFor(10000);

  // const dom = await page.$eval('#page_1', (element) => {
  //   return element.innerHTML;
  // });

  // await page.setContent(dom);
  const pdfDocument = new jsPDF();
  pdfDocument.addPage();

  for await (let pageNumber of [...Array(pagesCount).keys()]) {
    const selector = `#page_${pageNumber + 1}`;
    await page.waitForSelector(selector);
    await page.evaluate(
      (selector, pdfDocument) => {
        const el = document.querySelector(selector);
        el.scrollIntoView();

        // const image = el.toDataURL('image/png', 1.0);
        // pdfDocument.addPage();
        // pdfDocument.modules.addImage(image, 'PNG', 10, 10);

        // const image = el
        //   .toDataURL('image/jpeg', 1.0)
        //   .replace('image/png', 'image/octet-stream');
        // window.location.href = image;
      },
      selector,
      pdfDocument
    );
  }

  pdfDocument.save('output.pdf');

  // await page.pdf({ path: 'test.pdf', format: 'A4', printBackground: true });
  console.log('Завершено');
  await browser.close();
}

export { runParser };
