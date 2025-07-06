const { readTestData } = require('../../utils/fileUtils/readExcel.js');
const { RequestorLoginPage } = require('../../pages/requestor/RequestorLoginPage.js');
const { expect,test} = require('@playwright/test');

const testData = readTestData('./testdata/Data.xlsx', 'login');

test.describe('SSO login functionality Test', ()=> {
        
     for(const {Role, Email, Password, ExpectedResult} of testData){
      if(Role === 'requestor'){
        test(`Login Test for: ${Email+" "+Password}`, async ({page})=>{
        let requestorLogin = new RequestorLoginPage(page); 
        await requestorLogin.goto();
        await requestorLogin.OpenSSOlogin();
        const pages = page.context().pages();
        const newPage = pages[pages.length - 1];
        requestorLogin = new RequestorLoginPage(newPage);
        await requestorLogin.SSOLogin(Email,Password);
        await page.bringToFront();
        await page.waitForURL(ExpectedResult,{timeout : 5000});
        await expect(page).toHaveURL(ExpectedResult); 
        }  );
     }};
});
 