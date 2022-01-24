import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import config from './config.js';
import * as fs from 'fs';

class Parser {
  _browser = null;
  _page = null;
  _logInURL = null;
  _email = null;
  _password = null;

  constructor() {
    this._logInURL = config.logInURL;
    this._email = config.email;
    this._password = config.password;
  }

  async run() {
    try {
      this._browser = await puppeteer.launch({
        headless: false, // false: enables one to view the Chrome instance in action
        defaultViewport: null, // (optional) useful only in non-headless mode
      });

      this._page = await this._browser.newPage();
      await this._page.setDefaultNavigationTimeout(0);

      await this._logIn();
    } catch (e) {
      console.log(`Произошла ошибка во время запуска: ${e.message}`);
      await this.browser.close();
    }
  }

  async saveBook(url) {
    await this._page.goto(`${url}#page/1`);

    await this._page.waitForSelector('#viewer__header__title');
    const bookTitle = await this._page.$eval(
      '#viewer__header__title',
      (element) => element.innerHTML.trim().substring(0, 15)
    );

    await this._page.waitForSelector('#viewer__bar__pages-scale > span:nth-child(3)');
    const pagesCount = await this._page.$eval(
      '#viewer__bar__pages-scale > span:nth-child(3)',
      (element) => parseInt(element.innerHTML.substring(2), 10)
    );

    await this._page.waitForSelector('#viewer__wrapper__buttons > div:nth-child(1)');
    // await page.evaluate(() => {
    //   const zoomIn = document.querySelector(
    //     '#viewer__wrapper__buttons > div:nth-child(1)'
    //   );
    //   zoomIn.click();
    //   zoomIn.click();
    //   zoomIn.click();
    //   zoomIn.click();
    // });

    const pdfDocument = await PDFDocument.create();

    for await (let pageNumber of [...Array(pagesCount).keys()]) {
      const pdfPage = await pdfDocument.addPage();
      const { width, height } = pdfPage.getSize();

      const selector = `#page_${pageNumber + 1}`;
      await this._page.waitForSelector(selector);

      const image = await this._page.evaluate((selector) => {
        const el = document.querySelector(selector);
        el.scrollIntoView();

        return el.toDataURL('image/png', 1.0);
      }, selector);

      const pngImage = await pdfDocument.embedPng(image);

      pdfPage.drawImage(pngImage, {
        width: width,
        height: height,
      });
    }

    const pdfBytes = await pdfDocument.save();
  fs.writeFile(`${bookTitle}.pdf`, pdfBytes, function (error) {
    if (error) throw error;
    console.log('Данные успешно записаны записать файл');
  });
  }

  async _logIn() {
    await this._page.goto(this._logInURL, { waitUntil: 'networkidle2' });

    await this._page.evaluate(
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
      this._email,
      this._password
    );

    await this._page.waitForNavigation();
  }
}

export default Parser;
