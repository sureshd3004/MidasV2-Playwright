const { test, expect } = require('@playwright/test');
const { RequestorLoginPage } = require('../pages/requestor/RequestorLoginPage.js');
const { TechnicalLoginPage } = require('../pages/technical/TechnicalLoginPage.js');
const { readTestData } = require('../utils/fileUtils/readExcel.js');
const path = require('path');

const testData = readTestData('./testdata/Data.xlsx', 'login');

const testEx = test.extend({
  page: async ({ page }, use, testInfo) => {

    let fileName = path.basename(testInfo.file).toLowerCase();
    
    await page.goto('https://midasnvqa.infoplusmdm.com/');
    
    if (fileName.startsWith('requestor')) {
      for (const { Role, Email, Password, ExpectedResult } of testData) {
        if (Role === 'requestor') {
          let requestorLogin = new RequestorLoginPage(page);
          await requestorLogin.OpenSSOlogin();
          const pages = page.context().pages();
          const newPage = pages[pages.length - 1];
          requestorLogin = new RequestorLoginPage(newPage);
          await requestorLogin.SSOLogin(Email, Password);
          await page.bringToFront();
        }
      }
    } else if (fileName.startsWith('technical')) {
      for (const { Role, Email, Password, ExpectedResult } of testData) {
        if (Role === 'technical') {
          const login = new TechnicalLoginPage(page);
          await login.login(Email, Password);
        }
      }
    }

    page.on('response', async (response) => {
      const status = response.status();
      const url = response.url();
      const type = response.request().resourceType();

      if ((type === 'xhr' || type === 'fetch') && status >= 400) {
        const message = `❌ API Failed → Status: ${status} | URL: ${url}`;
        // Add to Playwright report
        testInfo.annotations.push({
          type: 'warning', 
          description: message
        });
      }
    });
    await use(page);
  }
});

module.exports = { test: testEx, expect };