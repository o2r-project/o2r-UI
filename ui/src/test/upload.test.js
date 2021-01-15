const timeout = 100000;

beforeAll(async () => {
    await page.goto(URL, { waitUntil: "domcontentloaded" });
});

describe("Test upload", () => {

   /**  test("Try upload without login", async () => {
        const inputUploadHandle = await page.$('input[type=file]');

        // prepare file to upload
        let fileToUpload = 'C:/Users/nick1/Documents/o2r/o2r-UI-fork/ui/src/test/insyde_workspace.zip';
        inputUploadHandle.uploadFile(fileToUpload);
        await page.waitForTimeout(2000)
        await page.click('#upload')
        await page.waitForTimeout(2000)

        const handle = await page.waitForSelector('#err', {visilbe: true})
        const html = await page.evaluate(handle => handle.innerHTML, handle);

        expect(html).toBe("This is the metadata we extracted out of your workspace. Is it correct? Fine, click the save button on the right. No? Make some changes and click on save.");
    }, timeout);*/

    test("Login", async () => {

        await page.click('#login')
        //await page.waitForNavigation();
        await page.waitForTimeout(2000)
        //await page.screenshot({ path: 'login.jpg', type: 'jpeg' });
        await page.click('#regular');
        await page.waitForNavigation();

        const handle = await page.$("#login");
        const html = await page.evaluate(handle => handle.innerText, handle);

        expect(html).toBe("LOGOUT");

    }, timeout);

    test("Try upload with login", async () => {

        const inputUploadHandle = await page.$('input[type=file]');

        // prepare file to upload
        let fileToUpload = './src/test/insyde_workspace.zip';
        inputUploadHandle.uploadFile(fileToUpload);
        await page.waitForTimeout(2000)
        await page.click('#upload')
        await page.waitForNavigation();
        await page.waitForTimeout(2000)
        //await page.screenshot({ path: 'image.jpg', type: 'jpeg' });
  

        const handle = await page.$("h3");
        const html = await page.evaluate(handle => handle.innerText, handle);

        expect(html).toBe("This is the metadata we extracted out of your workspace. Is it correct? Fine, click the save button on the right. No? Make some changes and click on save.");
    }, timeout);

});