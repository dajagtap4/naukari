const { test, expect } = require('@playwright/test');
const credSet = JSON.parse(JSON.stringify(require("../users/creds.json")));
const path = require('path');

for (const cred of credSet) {

  test.describe(`${cred.accName} profile update`, () => {

    test.beforeEach(async ({ page }) => {

      console.log(`\n🚀 \x1b[1m\x1b[34m================= ${cred.accName} 🚧 Started =================\x1b[0m\n`);

      await page.goto("https://www.naukri.com/");
      await page.waitForLoadState('networkidle');

      // login
      await page.locator("#login_Layer").click();
      await page.waitForLoadState('networkidle');

      await page.locator("[name=login-form]>div:nth-child(2)>input").fill(cred.username);
      await page.locator("[name=login-form]>div:nth-child(3)>input").fill(cred.password);
      await page.locator(".btn-primary.loginButton").click();
      await page.waitForLoadState('networkidle');

      // verify login with url
      await page.waitForURL('https://www.naukri.com/mnjuser/homepage', { timeout: 10000 });
      expect(page.url()).toContain("https://www.naukri.com/mnjuser/homepage");
      console.log(`🔐 Logged in`);

    });

    test.afterEach(async ({ page }) => {

      // navigate to profile
      await page.locator("img[alt='naukri user profile img']").click();

      // logout
      await expect(page.getByText('Logout')).toBeVisible();
      await page.locator('text=Logout').click();

      // verify logout with url
      expect(page.url()).toContain("https://www.naukri.com/");
      const istTime = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
      console.log(`🕒[${istTime}]`);
      console.log(`\n\x1b[1m\x1b[32m🔁 ================= ${cred.accName} ✅ Updated & Logged Out =================\x1b[0m\n`);

      await page.close();

    });

    test(`TC : 001 - update resume for account ${cred.accName}`, async ({ page }) => {

      // navigate to profile
      await page.locator("img[alt='naukri user profile img']").click();
      // await page.waitForLoadState('networkidle');

      await page.locator('text=View & Update Profile').click();
      // await page.waitForLoadState('networkidle');

      // relative path
      const filePath = path.resolve(__dirname, '../resume/QA_DeepakJ_Resume.pdf');

      // Listen for file chooser event
      const [fileChooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.click('input[value="Update resume"]'), // Triggers the file chooser
      ]);

      // Set the PDF file to the file chooser
      await fileChooser.setFiles(filePath);

      // verify resume uploaded
      const message = page.locator('text=Resume has been successfully uploaded.');
      await expect(message).toBeVisible();
      console.log(`📝 TC:001 - Resume updated.`);
      
    });

    test(`TC : 002 - update data for account ${cred.accName}`, async ({ page }) => {

      // navigate to profile
      await page.locator("img[alt='naukri user profile img']").click();
      // await page.waitForLoadState('networkidle');

      await page.locator('text=View & Update Profile').click();
      // await page.waitForLoadState('networkidle');

//✏️ Basic details 
      await page.locator('.hdn>em').click();
      // Save button
      await page.locator('.action.s12>button').click();
      // verify basic details updated by asserting the text "Today".
      const today_text = page.locator('.subhdn>div>span>span');
      await expect(today_text).toBeVisible();
      await expect(today_text).toHaveText('Today');
      console.log(`📝 TC:002 - Basic details updated.`);
      

//✏️ Resume headline
      await page.locator('#lazyResumeHead>div>div span:last-child').click();
      await page.locator('.row.form-actions button').click();
      const message = page.locator('text=Resume Headline has been successfully saved.');
      await expect(message).toBeVisible();
      await expect(message).toHaveText('Resume Headline has been successfully saved.');
      console.log(`📝 TC:002 - Resume headline updated.`);
      

    });

    test(`TC : 003 - share interest`, async ({ page }) => {
  // for (let i = 1; i <= 3; i++) {
  //   await test.step(`Execution round ${i}`, async () => {
  //     console.log(`\n🔄 TC:003 - Share Interest - Round ${i}`);
      
      test.setTimeout(100000);

      if (await page.locator("#s2j-ear-component>div>div+a").isVisible()) {
        await page.locator("#s2j-ear-component>div>div+a").click();
        await page.locator('.unshared').first().click();
        await page.waitForTimeout(1000);
      } else {
        console.log("🔔 Heads up: No early access roles available for you right now. Stay tuned!");
        return;
      }

      const buttons = page.locator('article');
      const count = await buttons.count();
      console.log(`🔎 TC:003 - Total articles found: ${count}`);

      await page.waitForTimeout(1000);
      if (count === 0) {
        console.log(`📝 TC:003 - No articles found to 'share interest-1'`);
        return;
      }

      let clickCount = 0;

      for (let i = 0; i < count; i++) {
        const button_text = await buttons.nth(i).locator('>div:last-child>div:last-child>button').textContent();
        if (button_text === 'Share Interest') {
          await buttons.nth(i).locator('>div:last-child>div:last-child>button').click();
          await page.waitForTimeout(500);
          clickCount++;
        } else {
          console.log(`📝 TC:003 - No 'Share Interest' button found-2.`);
        }
      }
      console.log(`✅ TC:003 - Total 'Share Interest' buttons clicked: ${clickCount}`);
    });
//   }
// });


});
}