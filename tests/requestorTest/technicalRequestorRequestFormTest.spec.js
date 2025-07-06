const { test ,expect} = require('../../testBase/testBase.js');
const { readTestData } = require('../../utils/fileUtils/readExcel.js');
const { RequestorRequestFormPage } = require('../../pages/requestor/RequestorRequestFormPage.js');
const { extractUrlFromEmail, createTemporaryEmail } = require('../../utils/mailUtils/mailUtils.js');
const testBase = require('../../testBase/testBase.js');
const { TestUtils } = require('../../utils/testUtils/TestUtils.js');

let vendorForm;
const formData = readTestData('./testdata/Data.xlsx', 'RequestData');


test.beforeEach(async ({ page }) => {
  vendorForm = new RequestorRequestFormPage(page);
  
});

test.describe('Vendor Request Form - Requestor Flow', () => {
  for (const data of formData) {
    if (data.RequestType === 'New') {
      test(`Create Vendor Request for ${data.Name}`, async () => {
        await vendorForm.openVendorRequestPage();
        await vendorForm.openVendorForm();
        await vendorForm.selectCompany(data.Company);

        const email = await createTemporaryEmail();
        await vendorForm.fillVendorFormFields({
            name: data.Name,
            mobile: data.MobileNumber,
            email,
            vendorType: data.VendorType,  
        });
        if(data.SearchTerm!==null){
        await vendorForm.searchTermFill(data.SearchTerm);
        }

        if(data.Existing_vendor_for_similar_products === 'yes'){
        await vendorForm.clcikExistingVendorForSimilarProduct(data.Existing_vendor_for_similar_products);
        await vendorForm.fillRequestReason(data.RequestReason);
        }

        await vendorForm.clickSubmit();
        await vendorForm.getNotificationText('Created');
      });
    }
  }
});

test.describe('Vendor Request Search', () => {
for (const data of formData) {
 if (data.SearchData) { 
    test(`Search "${data.SearchData}" for Vendor Request Page`, async () => {
      await vendorForm.openVendorRequestPage();
      const result = await vendorForm.vendorRequestSearch(data.SearchData);
      await expect(result).toBeTruthy();
    });
}};
});

test('Sort Coloumns in grid', ()=>{
       vendorForm.sortAndValidateFGridColumns();
})

test('Delete Request', ({page})=>{
       
 
});

