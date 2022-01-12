import ParsingFormData from "../components/Form/Types";
import puppeteer from 'puppeteer';
import config from "./config";

async function parser(values: ParsingFormData) {
  console.log(values);

  // const browser = await puppeteer.launch({
  //   headless: true, // false: enables one to view the Chrome instance in action
  //   defaultViewport: null, // (optional) useful only in non-headless mode
  // });

  // const page = await browser.newPage();
  // await page.goto(config.siteURL, { waitUntil: 'networkidle2' });
}

export default parser;