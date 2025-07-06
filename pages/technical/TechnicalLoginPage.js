const { expect } = require('@playwright/test');

class TechnicalLoginPage {
  
  constructor(page) {
    this.page = page;
    this.technicalTab = page.locator('//p-tab[@id="pn_id_12_tab_0"]');
    this.emailInput = page.locator('#emailId');
    this.passwordInput = page.locator('#password');
    this.signInButton = page.getByRole('button', { name: 'Sign in' });
    this.toastAlert = page.locator('//p-toastitem//div[@role="alert"]');
    this.midasLogo = page.locator('//img[@alt="MIDAS Logo"]');
    this.clientLogo = page.locator('//img[@class="bg-[#1F3A63] w-[100px] h-[80px] rounded-lg object-contain"]');
    this.mainImage = page.locator('//div[contains(@class,"text-white text-xs sm")]');
    this.infoplusMDMLogo = page.locator('//svg-icon[contains(@src,"assets")]');
  }

  async goto() {
    await this.page.goto('https://midasnvqa.infoplusmdm.com/sign-in/');
  }

  async login(email, password) {
   // await this.technicalTab.click();    
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click({ force: true });
  }

  async assertLoginResult(expectedText) {
    await expect(this.toastAlert).toContainText(expectedText);
  }

  async isLogoVisible(){
   await expect.soft(this.midasLogo).toBeVisible();
   await expect.soft(this.clientLogo).toBeVisible();
   await expect.soft(this.infoplusMDMLogo).toBeVisible();
   await expect.soft(this.mainImage).toBeVisible();
  } 
};

module.exports = { TechnicalLoginPage };
