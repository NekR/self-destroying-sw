const puppeteer = require('puppeteer');
const { exec } = require('child_process');
const path = require('path');
const cpr = require('cpr');
const server = require('./server');

const SERVER = `http://127.0.0.1:9191/`;

module.exports = new Promise((resolve) => {
  after(async () => {
    (await server).close();
    resolve();
  });
});

describe('testing install and fix', async () => {
  let browser;
  let page;
  let first;
  let second;

  before(async () => {
    await server;

    await new Promise((resolve, reject) => {
      cpr(
        path.join(__dirname, 'www_broken'),
        path.join(__dirname, 'www'), {
          deleteFirst: true,
          overwrite: true,
          confirm: true,
        }, (err) => {
          if (err) {
            reject(err);
            return;
          }

          resolve();
        }
      );
    });

    browser = await puppeteer.launch({
      headless: true
    });

    page = await browser.newPage();
  });

  after(async () => {
    await browser.close();
  });

  it('should open page and install service-worker', async () => {
    await page.goto(SERVER);
    await page.evaluate(function() {
      return navigator.serviceWorker.ready;
    });
  });

  it('should open 2 pages from the cache and reload current one', async () => {
    ([ first, second ] = await Promise.all([
      browser.newPage(), browser.newPage()
    ]));

    await Promise.all([
      first.goto(SERVER),
      second.goto(SERVER),
      page.reload()
    ]);

    await Promise.all([
      await first.evaluate(function() {
        const page = document.body.textContent.trim();

        if (page !== 'Cached') {
          throw new Error('Incorrect page:' + page);
        }
      }),
      await second.evaluate(function() {
        const page = document.body.textContent.trim();

        if (page !== 'Cached') {
          throw new Error('Incorrect page:' + page);
        }
      }),
      await page.evaluate(function() {
        const page = document.body.textContent.trim();

        if (page !== 'Cached') {
          throw new Error('Incorrect page:' + page);
        }
      })
    ]);
  });

  it('should write fixed code and reload main page, all pages should reload', async () => {
    await new Promise((resolve, reject) => {
      cpr(
        path.join(__dirname, 'www_fixed'),
        path.join(__dirname, 'www'), {
          // deleteFirst: true,
          overwrite: true,
          confirm: true,
        }, (err) => {
          if (err) {
            reject(err);
            return;
          }

          resolve();
        }
      );
    });

    await page.reload();

    await new Promise(resolve => {
      let reloads = 0;

      let onReload = () => {
        reloads++;

        if (reloads >= 3) {
          resolve();
        }
      };

      page.once('load', onReload);
      first.once('load', onReload);
      second.once('load', onReload);
    });
  });

  it('should load all pages from the network with fixed content', async () => {
    await Promise.all([
      await first.evaluate(function() {
        const page = document.body.textContent.trim();

        if (page !== 'Fixed') {
          throw new Error('Incorrect page:' + page);
        }
      }),
      await second.evaluate(function() {
        const page = document.body.textContent.trim();

        if (page !== 'Fixed') {
          throw new Error('Incorrect page:' + page);
        }
      }),
      await page.evaluate(function() {
        const page = document.body.textContent.trim();

        if (page !== 'Fixed') {
          throw new Error('Incorrect page:' + page);
        }
      })
    ]);
  });
});