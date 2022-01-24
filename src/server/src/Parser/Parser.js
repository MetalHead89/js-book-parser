import puppeteer from 'puppeteer';
import config from './config.js';

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
