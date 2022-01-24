import { jsPDF } from 'jspdf';
import { PDFDocument } from 'pdf-lib';
import html2canvas from 'html2canvas';
import puppeteer from 'puppeteer';
import config from './config.js';
import * as fs from 'fs';

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
    // await closeModalWindow();
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

  if (page.url() === 'https://urait.ru/') {
    await saveBook(
      'https://urait.ru/viewer/vysshaya-matematika-dlya-gumanitarnyh-napravleniy-489374'
    );
  }
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

  // if (page.url() === 'https://urait.ru/') {
  //   await saveBook(
  //     'https://urait.ru/viewer/vysshaya-matematika-dlya-gumanitarnyh-napravleniy-489374'
  //   );
  // }
}

async function saveBook(url) {
  await page.goto(`${url}#page/1`);

  await page.waitForSelector('#viewer__bar__pages-scale > span:nth-child(3)');
  const pagesCount = await page.$eval(
    '#viewer__bar__pages-scale > span:nth-child(3)',
    (elem) => parseInt(elem.innerHTML.substring(2), 10)
  );

  await page.waitForSelector('#viewer__wrapper__buttons > div:nth-child(1)');
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
    await page.waitForSelector(selector);

    const image = await page.evaluate((selector) => {
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
  fs.writeFile('output.pdf', pdfBytes, function (error) {
    if (error) throw error;
    console.log('Данные успешно записаны записать файл');
  });

  console.log('Завершено');
  await browser.close();
}

// async function saveBook(url) {
//   await page.goto(`${url}#page/1`);

//   await page.waitForSelector('#viewer__bar__pages-scale > span:nth-child(3)');
//   const pagesCount = await page.$eval(
//     '#viewer__bar__pages-scale > span:nth-child(3)',
//     (elem) => parseInt(elem.innerHTML.substring(2), 10)
//   );

//   await page.waitForSelector('#viewer__wrapper__buttons > div:nth-child(1)');
//   await page.evaluate(() => {
//     const zoomIn = document.querySelector(
//       '#viewer__wrapper__buttons > div:nth-child(1)'
//     );
//     zoomIn.click();
//     zoomIn.click();
//     zoomIn.click();
//     zoomIn.click();
//   });

//   // const pdfDocument = await PDFDocument.create();

//   for await (let pageNumber of [...Array(pagesCount).keys()]) {
//     // const pdfPage = await pdfDocument.addPage();
//     // const { width, height } = pdfPage.getSize();

//     const selector = `#page_${pageNumber + 1}`;

//     console.log(selector);

//     await scrollToNextPage(selector);

//     // await new Promise((resolve, reject) => )
//     // const pdfPage = await pdfDocument.addPage();
//     // const { width, height } = pdfPage.getSize();

//     // const selector = `#page_${pageNumber + 1}`;
//     // await page.waitForSelector(selector);

//     // const image = await page.evaluate(async (selector) => {
//     //   const el = document.querySelector(selector);
//     //   el.scrollIntoView(false);

//     //   return el.toDataURL('image/png', 1.0);
//     // }, selector);

//     // const pngImage = await pdfDocument.embedPng(image);

//     // pdfPage.drawImage(pngImage, {
//     //   width: width,
//     //   height: height,
//     // });
//     // pdfDocument.addImage(image, 'SVG', 10, 10, documentWidth, documentHeight);
//   }

//   // await autoScroll();

//   // const pdfDocument = await PDFDocument.create();

//   // for await (let pageNumber of [...Array(pagesCount).keys()]) {
//   //   const pdfPage = await pdfDocument.addPage();
//   //   const { width, height } = pdfPage.getSize();

//   //   const selector = `#page_${pageNumber + 1}`;
//   //   await page.waitForSelector(selector);

//   //   const image = await page.evaluate((selector) => {
//   //     const el = document.querySelector(selector);
//   //     el.scrollIntoView(false);

//   //     return el.toDataURL('image/png', 1.0);
//   //   }, selector);

//   //   const pngImage = await pdfDocument.embedPng(image);

//   //   pdfPage.drawImage(pngImage, {
//   //     width: width,
//   //     height: height,
//   //   });
//   //   // pdfDocument.addImage(image, 'SVG', 10, 10, documentWidth, documentHeight);
//   // }

//   // const pdfBytes = await pdfDocument.save();
//   // fs.writeFile('output.pdf', pdfBytes, function (error) {
//   //   if (error) throw error;
//   //   console.log('Данные успешно записаны записать файл');
//   // });
//   // pdfDocument.save('output.pdf');

//   console.log('Завершено');
//   // await browser.close();
// }

async function scrollToNextPage(selector) {
  await page.waitForSelector(selector);

  await page.evaluate(async (selector) => {
    const page = document.querySelector(selector);
    page.scrollIntoView(false);
  }, selector);

  await page.waitForNavigation({waitUntil: 'networkidle0'})
}

async function autoScroll() {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 10);
    });
  });
}

// async function saveBook(url) {
//   await page.goto(`${url}#page/1`);

//   await page.waitForSelector('#viewer__bar__pages-scale > span:nth-child(3)');
//   const pagesCount = await page.$eval(
//     '#viewer__bar__pages-scale > span:nth-child(3)',
//     (elem) => parseInt(elem.innerHTML.substring(2), 10)
//   );

//   await page.waitForSelector('#viewer__wrapper__buttons > div:nth-child(1)');
//   await page.evaluate(() => {
//     const zoomIn = document.querySelector(
//       '#viewer__wrapper__buttons > div:nth-child(1)'
//     );
//     zoomIn.click();
//     zoomIn.click();
//     zoomIn.click();
//     zoomIn.click();
//   });

//   const pdfDocument = await PDFDocument.create();
//   // const documentWidth = pdfDocument.internal.pageSize.getWidth();
//   // const documentHeight = pdfDocument.internal.pageSize.getHeight();

//   for await (let pageNumber of [...Array(pagesCount).keys()]) {
//     // console.log(pageNumber + 1);

//     // if (pageNumber !== 0) {
//     //   pdfDocument.addPage();
//     // }
//     const pdfPage = await pdfDocument.addPage();
//     const { width, height } = pdfPage.getSize();

//     const selector = `#page_${pageNumber + 1}`;
//     await page.waitForSelector(selector);

//     const image = await page.evaluate((selector) => {
//       const el = document.querySelector(selector);
//       el.scrollIntoView();

//       return el.toDataURL('image/png', 1.0);
//     }, selector);

//     const pngImage = await pdfDocument.embedPng(image);

//     pdfPage.drawImage(pngImage, {
//       width: width,
//       height: height,
//     });

//     // pdfDocument.addImage(image, 'SVG', 10, 10, documentWidth, documentHeight);
//   }

//   const pdfBytes = await pdfDocument.save();
//   fs.writeFile('output.pdf', pdfBytes, function (error) {
//     if (error) throw error;
//     console.log('Данные успешно записаны записать файл');
//   });
//   // pdfDocument.save('output.pdf');

//   console.log('Завершено');
//   await browser.close();
// }

// async function saveBook(url) {
//   await page.goto(`${url}#page/1`);

//   await page.waitForSelector('#viewer__bar__pages-scale > span:nth-child(3)');
//   const pagesCount = await page.$eval(
//     '#viewer__bar__pages-scale > span:nth-child(3)',
//     (elem) => parseInt(elem.innerHTML.substring(2), 10)
//   );

//   await page.waitForSelector('#viewer__wrapper__buttons > div:nth-child(1)');
//   await page.evaluate(() => {
//     const zoomIn = document.querySelector(
//       '#viewer__wrapper__buttons > div:nth-child(1)'
//     );
//     zoomIn.click();
//     zoomIn.click();
//     zoomIn.click();
//     zoomIn.click();
//   });

//   let pages = [];

//   for await (let pageNumber of [...Array(pagesCount).keys()]) {
//     const pdfDocument = new jsPDF();
//     const documentWidth = pdfDocument.internal.pageSize.getWidth();
//     const documentHeight = pdfDocument.internal.pageSize.getHeight();

//     const selector = `#page_${pageNumber + 1}`;
//     await page.waitForSelector(selector);

//     const image = await page.evaluate((selector) => {
//       const el = document.querySelector(selector);
//       el.scrollIntoView();

//       return el.toDataURL('image/png', 1.0);
//     }, selector);

//     pdfDocument.addImage(image, 'PNG', 10, 10, documentWidth, documentHeight);
//     pdfDocument.save(`${pageNumber + 1}.pdf`);
//     pages.push(`${pageNumber + 1}.pdf`);
//   }

//   console.log('Завершено');
//   await browser.close();
// }

// async function saveBook(url) {
//   await page.goto(`${url}#page/1`);

//   await page.waitForSelector('#viewer__bar__pages-scale > span:nth-child(3)');
//   const pagesCount = await page.$eval(
//     '#viewer__bar__pages-scale > span:nth-child(3)',
//     (elem) => parseInt(elem.innerHTML.substring(2), 10)
//   );

//   await page.waitForSelector('#viewer__wrapper__buttons > div:nth-child(1)');
//   await page.evaluate(() => {
//     const zoomIn = document.querySelector(
//       '#viewer__wrapper__buttons > div:nth-child(1)'
//     );
//     zoomIn.click();
//     zoomIn.click();
//     zoomIn.click();
//     zoomIn.click();
//   });

//   // const pdfDocument = new jsPDF();
//   // const documentWidth = pdfDocument.internal.pageSize.getWidth();
//   // const documentHeight = pdfDocument.internal.pageSize.getHeight();

//   for await (let pageNumber of [...Array(pagesCount).keys()]) {
//     console.log(pageNumber + 1);
//     // if (pageNumber !== 0) {
//     //   pdfDocument.addPage();
//     // }
//     const selector = `#page_${pageNumber + 1}`;
//     await page.waitForSelector(selector);

//     const canvas = await page.evaluate((selector) => {
//       const el = document.querySelector(selector);
//       el.scrollIntoView();

//       // return el.toDataURL('image/png', 1.0);
//     }, selector);

//     html2canvas(canvas).then((canvas => {
//       const image = canvas.toDataURL('image/png', 1.0)
//       const pdfDocument = new jsPDF();
//       pdfDocument.addImage(image, 'PNG', 10, 10);
//       pdfDocument.save('output.pdf');
//     })).catch((e) => e)

//     // pdfDocument.addImage(image, 'SVG', 10, 10, documentWidth, documentHeight);
//   }

//   // pdfDocument.save('output.pdf');

//   console.log('Завершено');
//   await browser.close();
// }

// async function saveBook(url) {
//   await page.goto(`${url}#page/1`);

//   await page.waitForSelector('#viewer__bar__pages-scale > span:nth-child(3)');
//   const pagesCount = await page.$eval(
//     '#viewer__bar__pages-scale > span:nth-child(3)',
//     (elem) => parseInt(elem.innerHTML.substring(2), 10)
//   );

//   await page.waitForSelector('#viewer__wrapper__buttons > div:nth-child(1)');
//   await page.evaluate(() => {
//     const zoomIn = document.querySelector(
//       '#viewer__wrapper__buttons > div:nth-child(1)'
//     );
//     zoomIn.click();
//     zoomIn.click();
//     zoomIn.click();
//     zoomIn.click();
//   });

//   const pdfDocument = new jsPDF();
//   const documentWidth = pdfDocument.internal.pageSize.getWidth();
//   const documentHeight = pdfDocument.internal.pageSize.getHeight();

//   for await (let pageNumber of [...Array(pagesCount).keys()]) {
//     console.log(pageNumber + 1);
//     if (pageNumber !== 0) {
//       pdfDocument.addPage();
//     }
//     const selector = `#page_${pageNumber + 1}`;
//     await page.waitForSelector(selector);

//     const image = await page.evaluate((selector) => {
//       const el = document.querySelector(selector);
//       el.scrollIntoView();

//       return el.toDataURL('image/svg', 1.0);
//     }, selector);

//     pdfDocument.addImage(image, 'SVG', 10, 10, documentWidth, documentHeight);
//   }

//   pdfDocument.save('output.pdf');

//   console.log('Завершено');
//   await browser.close();
// }

export { runParser };
