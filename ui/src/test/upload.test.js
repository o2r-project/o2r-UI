const timeout = 100000;

beforeAll(async () => {
    await page.goto(URL, { waitUntil: "domcontentloaded" });
    await page.setViewport({
        width: 1920,
        height: 1080
    })
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

        await page.screenshot({ path: 'screenshots/image10.jpg', type: 'jpeg', fullPage: true});
        const inputUploadHandle = await page.$('input[type=file]');
        await page.screenshot({ path: 'screenshots/image.jpg', type: 'jpeg' });

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
        await page.screenshot({ path: 'screenshots/image1.jpg', type: 'jpeg' });

        expect(html).toBe("This is the metadata we extracted out of your workspace. Is it correct? Fine, click the save button on the right. No? Make some changes and click on save.");
    }, timeout);

    test("Go to ERC is disabled", async () => {


        const is_disabled = await page.$eval('button[id=goTo]', (button) => {return button.disabled;});
        console.log(is_disabled)
        expect(is_disabled).toBe(true);

    }, timeout);

    test("Test publish", async () => {

        await page.click('#publish')
        await page.waitForTimeout(5000)
        await page.screenshot({ path: 'screenshots/image2.jpg', type: 'jpeg' });
        const is_disabled = await page.$eval('button[id=goTo]', (button) => {return button.disabled;});
        console.log(is_disabled)
        
        expect(is_disabled).toBe(false);

    }, timeout);

    test("Test goToERC", async () => {

        await page.click('#goTo')
        await page.waitForTimeout(2000)
        //await page.waitForNavigation();
        await page.screenshot({ path: 'screenshots/image3.jpg', type: 'jpeg' });
        
        
        const elementHandle = await page.$(
            'iframe',
        );
        const frame = await elementHandle.contentFrame();
        //const handle = await frame.$("h1");
        const html = await frame.$eval('h1', (html) => {return html.innerText;});

        expect(html).toBe("INSYDE: a synthetic, probabilistic flood damage model based on explicit cost analysis");


    }, timeout);



});

describe("Inspect ERC", () => {
 
 
     test("Go To startpage", async () => {
        await page.goto(URL, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(2000)

        const title = await page.title();

    
        expect(title).toBe("o2r");

     })

     test("Checout ERC 0", async () => {
        await page.click('#0')
        await page.waitForTimeout(2000)
        //await page.waitForNavigation();
        await page.screenshot({ path: 'screenshots/image5.jpg', type: 'jpeg' });
        
        
        const elementHandle = await page.$(
            'iframe',
        );
        const frame = await elementHandle.contentFrame();
        //const handle = await frame.$("h1");
        const html = await frame.$eval('h1', (html) => {return html.innerText;});

        expect(html).toBe("INSYDE: a synthetic, probabilistic flood damage model based on explicit cost analysis");



     })
 
 
 
 });