const { readTestData } = require('../../utils/fileUtils/readExcel.js');
const { TechnicalLoginPage } = require('../../pages/technical/TechnicalLoginPage.js');
const { test, expect } = require('@playwright/test');

const testData = readTestData('./testdata/Data.xlsx', 'login');

test.describe('Login Page Test - Technical Role', () => {
    
    for (const { Role, Email, Password, ExpectedResult } of testData) {
    if (Role === 'technical') {
       test(`Login Test for: ${Email+" "+Password}`, async ({page}) => {
        const loginPage = new TechnicalLoginPage(page);
        await loginPage.goto();
        await loginPage.login(Email, Password);
        await expect(page).toHaveURL(ExpectedResult);
      });
    }};

    for(const {Role, Email, Password, ExpectedResult} of testData){
      if(Role === 'invalid_technical'){
        test(`Login Test for Invalid Data: ${Email+" "+Password}`, async({page}) =>{
          const loginpage = new TechnicalLoginPage(page);
          await loginpage.goto();
          await loginpage.login(Email,Password);
          await loginpage.assertLoginResult(ExpectedResult);
        });
    }};

    test('UI elements Visibility', async({page})=>{
        const loginPage = new TechnicalLoginPage(page);
        await loginPage.goto();
        await loginPage.isLogoVisible();
        await expect(page).toHaveTitle('Sign-in');
      });
});
