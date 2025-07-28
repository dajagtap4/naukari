const { test, expect } = require('@playwright/test');
const credSet = JSON.parse(JSON.stringify(require("../users/creds.json")));
const path = require('path');

for (const cred of credSet) {
  test(`update resume on naukari for account ${cred.accName}`, async ({ page }) => {
    await page.goto("https://www.naukri.com/");
    await page.waitForLoadState('networkidle');

    // Login
    await page.locator("#login_Layer").click();
    await page.waitForLoadState('networkidle');

    await page.locator("[name=login-form]>div:nth-child(2)>input").fill(cred.username);
    await page.locator("[name=login-form]>div:nth-child(3)>input").fill(cred.password);
    await page.locator(".btn-primary.loginButton").click();

    // Wait for login page URL with extended timeout (30 sec for slow CI)
    await page.waitForURL('https://www.naukri.com/mnjuser/homepage', { timeout: 30000 });
    expect(page.url()).toContain("https://www.naukri.com/mnjuser/homepage");

    // Navigate to profile
    await page.locator("img[alt='naukri user profile img']").click();
    await page.locator('text=View & Update Profile').click();

    // Upload resume (adjust path if needed)
    const filePath = path.resolve(__dirname, '../resume/QA_DeepakJ_Resume.pdf');

    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.click('input[value="Update resume"]'),
    ]);
    await fileChooser.setFiles(filePath);

    // Verify success message
    const message = page.locator('text=Resume has been successfully uploaded.');
    await expect(message).toBeVisible();

    // Logout flow
    await page.locator("img[alt='naukri user profile img']").click();
    await expect(page.getByText('Logout')).toBeVisible();
    await page.locator('text=Logout').click();

    expect(page.url()).toContain("https://www.naukri.com/");

    const istTime = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    console.log(`🕒[${istTime}] ✅ Resume updated for < ${cred.accName} > account`);
  });
}
