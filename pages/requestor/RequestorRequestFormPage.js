const { expect } = require('@playwright/test');
const { TestUtils } = require('../../utils/testUtils/TestUtils');

class RequestorRequestFormPage {
  constructor(page) {
    this.page = page;

    this.slider = page.locator('//*[@src="assets/icons/heroicons/solid/chevron-double-left.svg"]//*[name()="svg"]');
    this.vendorIcon = page.locator('div:nth-child(2) > .flex').first();
    this.vendorRequestIcon = page.locator('//a[text()=" Vendor Request "]');
    this.addVendorBtn = page.getByRole('button', { name: 'Create Vendor' });
    this.formTitle = page.locator('//a[text()=" Create Vendor "]');
    this.opanSelectCompany = page.getByText('Select Company');
    this.vendorNameField = page.locator('//input[@placeholder="Enter vendor name"]');
    this.mobNumField = page.locator('//input[@placeholder="Enter mobile number"]');
    this.emailField = page.locator('//input[@placeholder="Enter vendor email"]');
    this.openvendorTypeField = page.locator('//span[@aria-label="Select vendor"]');
    this.existingVendorForSimilarProduct = page.locator('//input[@role="switch"]');
    this.submitForm = page.locator('(//button[@type="submit"])[2]');
    this.searchTermField = page.locator('//input[@placeholder="Enter search terms"]');
    this.requestReason = page.locator('//textarea[@formcontrolname="requestReason"]');
    this.createdMsg = page.locator('//div[contains(@class, "p-toast-message-text")]/div[2]').first();
    this.gridRows = page.locator('//tbody/tr');
    this.searchBox = page.getByRole('textbox', { name: 'Search', exact: true });
    this.searchBtn = page.getByRole('button', { name: 'Search' });
    this.clerSearch = page.locator('#pn_id_10').getByRole('button', { name: '✕' });
    this.trash = page.getByRole('button', { name: 'Trash' });
  }

  async openVendorRequestPage() {
    await this.vendorIcon.click();
  }

  async openVendorForm() {
    await this.addVendorBtn.click();
    await expect(this.formTitle).toBeVisible();
  }

  async selectCompany(companies) {
    
    await this.opanSelectCompany.click();
    if(companies.includes(',')){
    for (const company of companies.split(',').trim()) {
    await this.page.locator(`//span[text()="${company}"]`).click();
    }} else {
      await this.page.locator(`//span[text()="${companies}"]`).click();
     }
  }

  async searchTermFill(SearchTerm) {
    await this.searchTermField.fill(SearchTerm);
  }

  async fillVendorFormFields({name, mobile, email, vendorType}) {
    await this.vendorNameField.fill(name);
    await this.mobNumField.fill(mobile);
    await this.emailField.fill(email);
    await this.openvendorTypeField.click();
    await this.page.getByRole('option', { name: vendorType }).click();
  }

  async fillRequestReason(reason) {
    await this.requestReason.fill(reason);  
  }

  async clcikExistingVendorForSimilarProduct() {
    await this.existingVendorForSimilarProduct.click();
  }

  async isSubmitButtonEnabled() {
    return await this.submitForm.isEnabled();
  }

  async clickSubmit() {
    await this.submitForm.click();
  }

  async getNotificationText(expected) {
    await expect(this.createdMsg).toContainText(expected);
  }
 
  async getColumnLocator(columnName) {
    return this.page.locator(`xpath=//th[normalize-space()="${columnName}"]`);
  }

async vendorRequestSearch(searchText) {
  const rows = await this.gridRows.count();

  for (let index = 0; index < rows; index++) {
    const row = this.page.locator('//tbody/tr').nth(index);
    const hasText = await row.textContent();
   console.log(hasText);
    if (hasText && hasText.includes(searchText)) {
      console.log('inside if')
      return true; 
    }}
  return false; 
}

async sortAndValidateFGridColumns() {
  const totalColumns = 9;
  // const totalRows = await this.page.locator('//tbody/tr').count();
  //   console.log(totalRows);
  for (let colIndex = 2; colIndex <= totalColumns; colIndex++) {
    const headerLocator = this.page.locator(`//thead/tr/th[${colIndex}]`);
    const headerText = await headerLocator.textContent();
    console.log(headerText);
    for (let sortOrder = 0; sortOrder < 2; sortOrder++) {
      await headerLocator.click(); 

      let columnValues = [];
      for (let row = 1; row <= 10; row++) {
        const cell = this.page.locator(`//tbody/tr[${row}]/td[${colIndex}]`);
        const text = await cell.textContent();
        columnValues.push(text?.trim() || '');
      }

      //columnValues = columnValues.filter(v => v !== '');
      const sorted = [...columnValues].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
      if (sortOrder === 1) sorted.reverse();

      const match = JSON.stringify(columnValues) === JSON.stringify(sorted);

      expect(match).toBeTruthy();
    }
  }}

};
module.exports = { RequestorRequestFormPage };
