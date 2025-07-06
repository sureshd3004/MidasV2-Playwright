const { expect } = require('@playwright/test');

class RequestorLoginPage{

     constructor(page){
         this.page = page;
         this.toastAlert = page.locator('//p-toastitem//div[@role="alert"]');
         this.requestorTab = page.locator('//p-tab[text()="User"]');
         this.SSOLoginIcon = page.locator('//button[contains(@class,"font-semibold focus-visible:outline-none flex items")]');
         this.SSONext = page.locator('//input[@id="idSIButton9"]');
         this.SSOEmail = page.locator('//input[@id="i0116"]');
         this.SSOPassword = page.locator('//input[@id="i0118" or type="password" or name="passwd"]');
         this.SSOPasswordSudmit = page.locator('//*[@type="submit"]');
         this.yesConfirm = page.locator('//input[@id="idSIButton9" or type="submit"]');
     }

        async  goto() {
        await this.page.goto("https://midasnv.infoplusmdm.com/sign-in");
     } 
        async  OpenSSOlogin() {
        await this.requestorTab.click();
        await this.SSOLoginIcon.click();
     }
        async  SSOLogin(email,password) {
        await this.SSOEmail.fill(email);
        await this.SSONext.click();
        await this.SSOPassword.fill(password);
        await this.SSOPasswordSudmit.click();
        await this.yesConfirm.click();
     }
        async validateNotification(expectedResult) {
        await expect(this.toastAlert).toContainText(expectedResult);
     }
};
module.exports = { RequestorLoginPage };