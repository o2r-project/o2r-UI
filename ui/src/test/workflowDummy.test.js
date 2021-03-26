const timeout = 60000;

beforeAll(async () => {
    await page.goto(URL, { waitUntil: "domcontentloaded" });
    await page.setDefaultTimeout(0)
    await page.setViewport({
        width: 1920,
        height: 1080
    })
});

describe("Test upload", () => {

    test("Login", async () => {

        let handle = await page.$("#login");
        let html = await page.evaluate(handle => handle.innerText, handle);

        if(html !== "LOGOUT"){
            await page.click('#login')
            //await page.waitForNavigation();
            await page.waitForTimeout(3000)
            await page.screenshot({ path: 'screenshots/dummylogin.jpg', type: 'jpeg' });
            await page.click('#regular');
            await page.waitForNavigation();
        }

        handle = await page.$("#login");
        html = await page.evaluate(handle => handle.innerText, handle);

        expect(html).toBe("LOGOUT");

    }, timeout);

    test("Try upload with login", async () => {

        
        const inputUploadHandle = await page.$('input[type=file]');
        //await page.screenshot({ path: 'screenshots/StartPageLoggedIn.jpg', type: 'jpeg' });

        // prepare file to upload
        let fileToUpload = './src/test/dummy.zip';
        inputUploadHandle.uploadFile(fileToUpload);
        await page.waitForTimeout(2000)
        await page.click('#upload')
        await page.waitForNavigation({waitUntil: 'networkidle2'});
        await page.waitForTimeout(2000)
        //await page.waitForSelector("h3")
        //await page.waitForNavigation({waitUntil: 'networkidle2'});
        //await page.screenshot({ path: 'image.jpg', type: 'jpeg' });
  

        const handle = await page.$("h3");
        const html = await page.evaluate(handle => handle.innerText, handle);
        await page.screenshot({ path: 'screenshots/dummyCreateERC.jpg', type: 'jpeg' });

        expect(html).toBe("This is the metadata we extracted out of your workspace. Is it correct? Fine, click the save button on the right. No? Make some changes and click on save.");
    }, timeout);

    test("Only Preview is possible", async () => {


        const handle = await page.$("#goTo");
        const html = await page.evaluate(handle => handle.innerText, handle);
        expect(html).toBe("PREVIEW");


    }, timeout);

    test("Test publish", async () => {

        await page.click('#least')
        await page.waitForTimeout(1000)

        await page.click('#publish')
        await page.waitForTimeout(5000)
        await page.screenshot({ path: 'screenshots/dummyCreateERCSavedMetadata.jpg', type: 'jpeg' });
        const handle = await page.$("#goTo");
        const html = await page.evaluate(handle => handle.innerText, handle);
        expect(html).toBe("GO TO ERC");

    }, timeout);

    test("Test goToERC", async () => {

        await page.click('#goTo')
        await page.waitForTimeout(3000)
        //await page.waitForNavigation();
        await page.screenshot({ path: 'screenshots/dummyERCView.jpg', type: 'jpeg' });
        
        
        const elementHandle = await page.$(
            'iframe',
        );
        const frame = await elementHandle.contentFrame();
        //const handle = await frame.$("h1");
        const html = await frame.$eval('body', (html) => {return html.innerText;});

        expect(html).toBe("dummy");


    }, timeout);



});

describe("Inspect ERC", () => {
 
 
     test("Go To startpage", async () => {
        await page.goto(URL, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(4000)

        const title = await page.title();

    
        expect(title).toBe("Home | o2r Demoserver");

     })

     test("Checout ERC 0", async () => {
        //await page.waitForTimeout(2000)
        await page.click('#button0')
        await page.waitForTimeout(2000)
        //await page.waitForNavigation();
        await page.screenshot({ path: 'screenshots/dummyERCView2.jpg', type: 'jpeg' });
        
        
        const elementHandle = await page.$(
            'iframe',
        );
        const frame = await elementHandle.contentFrame();
        //const handle = await frame.$("h1");
        const html = await frame.$eval('body', (html) => {return html.innerText;});

        expect(html).toBe("dummy");

     })

     test("Go To check", async () => {
        //await page.waitForTimeout(2000)
        await page.click('#check')
        await page.waitForTimeout(2000)
        //await page.waitForNavigation();
        await page.screenshot({ path: 'screenshots/dummyERCViewCheck.jpg', type: 'jpeg' });
        
        const handle = await page.$("#runAnalysis");
        const html = await page.evaluate(handle => handle.innerText, handle);

        expect(html).toBe("RUN ANALYSIS");
     })

     test("Start Analysis", async () => {
        
        await page.click('#runAnalysis')
        await page.waitForTimeout(2000)
        //await page.waitForNavigation();
        await page.screenshot({ path: 'screenshots/dummyanalysisStarted.jpg', type: 'jpeg' });
        
        const handle = await page.$("#stepOne");
        const html = await page.evaluate(handle => handle.innerText, handle);

        expect(html).toBe("1) Create configuration file: ");
     })

     test("Inspect Logs", async () => {
        
        
        await page.waitForTimeout(10000)
        //await page.waitForNavigation();
        await page.click("#logs")
        await page.waitForTimeout(1000)
        
        const handle = await page.$("#bag");
        const html = await page.evaluate(handle => handle.innerText, handle);

        expect(html).toBe("Validate bag:");
     }, timeout)

     test("Inspect Results", async () => {
        
        await page.waitForTimeout(1000)
        await page.click('#close')
        //await page.waitForNavigation();
        await page.click("#result")
        
        const handle = await page.$("#diffCaption");
        const html = await page.evaluate(handle => handle.innerText, handle);

        expect(html).toBe("Differences between original and reproduced results");
     })


     
    test("Go To Metadata", async () => {
        await page.waitForTimeout(1000)
        await page.click('#close')
        //await page.waitForTimeout(2000)
        await page.waitForTimeout(1000)
        await page.click('#metadata')
        await page.waitForTimeout(2000)
        //await page.waitForNavigation();
        await page.screenshot({ path: 'screenshots/dummyMetadata.jpg', type: 'jpeg' });
        
        const handle = await page.$("#title");
        const html = await page.evaluate(handle => handle.innerText, handle);

        expect(html).toBe("Title: This is the title: it contains a colon");
     })
 
     test("Go To Shipment", async () => {
         await page.click('.MuiTabScrollButton-root')
        //await page.waitForTimeout(2000)
        await page.click('#shipment')
        await page.waitForTimeout(2000)
        //await page.waitForNavigation();
        await page.screenshot({ path: 'screenshots/dummyShipment.jpg', type: 'jpeg' });
        
        const handle = await page.$("#description");
        const html = await page.evaluate(handle => handle.innerText, handle);

        expect(html).toBe("Create new Shipment:");
     })
 
 });