const timeout = 1000000;
const archiver = require('archiver');
var fs = require("fs");


beforeAll(async () => {
    await page.goto(URL, { waitUntil: "domcontentloaded" });
    await page.setDefaultTimeout(0)
    await page.setViewport({
        width: 1920,
        height: 1080
    })

    /** 
    
    const output = fs.createWriteStream(__dirname + '/bindings_workspace.zip');
    const archive = archiver('zip');

    output.on('close', function () {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
    });

    archive.pipe(output);

    archive.directory(__dirname +'/bindingsExample', false);

    archive.finalize();

    */
    
});

describe("Test upload 1", () => {


    test("Login", async () => {

        let handle = await page.$("#login");
        let html = await page.evaluate(handle => handle.innerText, handle);

        if (html !== "LOGOUT") {
            await page.click('#login')
            await page.waitForTimeout(3000)
            await page.screenshot({ path: 'screenshots/bindingslogin.jpg', type: 'jpeg' });
            await page.click('#regular');
            await page.waitForNavigation();
        }

        handle = await page.$("#login");
        html = await page.evaluate(handle => handle.innerText, handle);

        expect(html).toBe("LOGOUT");

    }, timeout);

    test("Try upload with login", async () => {


        const inputUploadHandle = await page.$('input[type=file]');

        
        let fileToUpload = './src/test/bindings_workspace.zip';
        inputUploadHandle.uploadFile(fileToUpload);
        await page.screenshot({ path: 'screenshots/bindingsUploadERC.jpg', type: 'jpeg' });
        await page.waitForTimeout(2000)
        await page.click('#upload')
        await page.screenshot({ path: 'screenshots/bindingsUploadERC2.jpg', type: 'jpeg' });
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
        await page.waitForTimeout(2000)


        const handle = await page.$("h3");
        const html = await page.evaluate(handle => handle.innerText, handle);
        await page.screenshot({ path: 'screenshots/bindingsCreateERC.jpg', type: 'jpeg' });

        expect(html).toBe("This is the metadata we extracted out of your workspace. Is it correct? Fine, click the save button on the right. No? Make some changes and click on save.");
    }, timeout);

    test("Only Preview is possible", async () => {


        const handle = await page.$("#goTo");
        const html = await page.evaluate(handle => handle.innerText, handle);
        expect(html).toBe("PREVIEW");


    }, timeout);

    test("Go to Bindings", async () => {

        await page.click('#bindings')
        await page.waitForTimeout(2000)
        const handle = await page.$("#label0");
        const html = await page.evaluate(handle => handle.innerText, handle);
        await page.screenshot({ path: 'screenshots/bindingsBindings.jpg', type: 'jpeg' });

        expect(html).toBe("Which figure should be made interactive?");

    }, timeout);


    test("Select plotFigure1", async () => {

        await page.select('#selectFigure', "plotFigure1(cars)");
        await page.waitForTimeout(4000)

        const handle = await page.$("#preview");
        const html = await page.evaluate(handle => handle.innerText, handle);

        expect(html).toBe("Preview of the interactive figure");


    }, timeout);

    test("Go to next step", async () => {

        await page.click('#next')
        const handle = await page.$("#label1");
        const html = await page.evaluate(handle => handle.innerText, handle);

        expect(html).toBe("Select the parameter which should be made possible to change");

    }, timeout);

        // https://stackoverflow.com/questions/60949856/e2e-testing-material-ui-select-with-puppeteer


        const MaterialSelect = async (page, newSelectedValue, cssSelector) => {
            await page.evaluate((newSelectedValue, cssSelector) => {
                var clickEvent = document.createEvent('MouseEvents');
                clickEvent.initEvent("mousedown", true, true);
                var selectNode = document.querySelector(cssSelector);
                selectNode.dispatchEvent(clickEvent);
                [...document.querySelectorAll('li')].filter(el => el.innerText == newSelectedValue)[0].click();
            }, newSelectedValue, cssSelector);
        }

    test("Select parameter and go to next step", async () => {

        await page.waitForTimeout(2000)

        await MaterialSelect(page, "minimumMilesPerGallon", '#selectP')

        await page.waitForTimeout(1000)
        await page.click('#next')
        await page.waitForTimeout(1000)


        const handle = await page.$(".MuiFormControlLabel-label");
        const html = await page.evaluate(handle => handle.innerText, handle);
        await page.screenshot({ path: 'screenshots/bindingsBindings2.jpg', type: 'jpeg' });

        expect(html).toBe("Slider");


    }, timeout);

    test("fill widget Information and create next parameter", async () => {

        await page.waitForTimeout(2000)

        await page.click('#min')
        await page.$eval('#min', el => el.value = 4);
        await page.$eval('#min', e => e.blur());

        await page.click('#max')
        await page.$eval('#max', el => el.value = 30);
        await page.$eval('#max', e => e.blur());

        await page.click('#step')
        await page.$eval('#step', el => el.value = 1);
        await page.$eval('#step', e => e.blur());

        await page.click('#captionSlider')
        await page.$eval('#captionSlider', el => el.value = 'Minimum distance in miles the car should come with one gallon');
        await page.$eval('#captionSlider', e => e.blur());
        await page.click('#min')
        await page.screenshot({ path: 'screenshots/bindingsBindingsSlider.jpg', type: 'jpeg' });

        await page.waitForTimeout(1000)

        await page.click('#add')

        const handle = await page.$("#label1");
        const html = await page.evaluate(handle => handle.innerText, handle);

        expect(html).toBe("Select the parameter which should be made possible to change");
    }, timeout);

    test("Select parameter and go to next step", async () => {

        await page.waitForTimeout(2000)


        await MaterialSelect(page, "numberOfCylinders", '#selectP')



        await page.waitForTimeout(1000)
        await page.click('#next')
        await page.waitForTimeout(1000)


        const handle = await page.$(".MuiFormControlLabel-label");
        const html = await page.evaluate(handle => handle.innerText, handle);
        await page.screenshot({ path: 'screenshots/bindingsBindings2.jpg', type: 'jpeg' });

        expect(html).toBe("Slider");


    }, timeout);


    test("change widget, fill Information and save", async () => {

        await page.click("#radio")
        await page.waitForTimeout(1000)
        await page.click("#chips")
        await page.$eval('#chips', el => el.value = 'all');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1000)
        await page.$eval('#chips', el => el.value = '4');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1000)
        await page.$eval('#chips', el => el.value = '6');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1000)
        await page.$eval('#chips', el => el.value = '8');
        await page.keyboard.press('Enter');
        await page.waitForTimeout(1000)
        await page.click('#captionRadio')
        await page.$eval('#captionRadio', el => el.value = 'Number of Cylinders of displayed cars');
        await page.$eval('#captionRadio', e => e.blur());
        await page.waitForTimeout(1000)


        await page.click('#save')
        await page.waitForTimeout(1000)

        await page.click('#next')
        await page.waitForTimeout(1000)


        const handle = await page.$("#text");
        const html = await page.evaluate(handle => handle.innerText, handle);
        await page.screenshot({ path: 'screenshots/bindingsBindingsFinished.jpg', type: 'jpeg' });

        expect(html).toBe("All steps completed - Feel free to create another binding");

    }, timeout);

    test("Test publish", async () => {

        await page.click('#required')
        await page.waitForTimeout(1000)

        await page.click('#publish')
        await page.waitForTimeout(5000)
        await page.screenshot({ path: 'screenshots/bindingsCreateERCSavedMetadata.jpg', type: 'jpeg' });
        const handle = await page.$("#goTo");
        const html = await page.evaluate(handle => handle.innerText, handle);
        expect(html).toBe("GO TO ERC");

    }, timeout);

    test("Test goToERC", async () => {

        await page.click('#goTo')
        await page.waitForTimeout(3000)
        await page.screenshot({ path: 'screenshots/bindingsERCView.jpg', type: 'jpeg' });


        const elementHandle = await page.$(
            'iframe',
        );
        const frame = await elementHandle.contentFrame();
        const html = await frame.$eval('h1', (html) => { return html.innerText; });

        expect(html).toBe("BindingsExample");


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
        await page.click('#button0')
        await page.waitForTimeout(2000)
        await page.screenshot({ path: 'screenshots/bindingsERCView2.jpg', type: 'jpeg' });


        const elementHandle = await page.$(
            'iframe',
        );
        const frame = await elementHandle.contentFrame();
        const html = await frame.$eval('h1', (html) => { return html.innerText; });

        expect(html).toBe("BindingsExample");

    })

    test("Go To check", async () => {
        await page.click('#check')
        await page.waitForTimeout(2000)
        await page.screenshot({ path: 'screenshots/bindingscheckView.jpg', type: 'jpeg' });

        const handle = await page.$("#runAnalysis");
        const html = await page.evaluate(handle => handle.innerText, handle);

        expect(html).toBe("RUN ANALYSIS");
    })
    
    

    test("Start Analysis", async () => {

        await page.click('#runAnalysis')
        await page.waitForTimeout(2000)
        await page.screenshot({ path: 'screenshots/bindingsanalysisStarted.jpg', type: 'jpeg' });

        const handle = await page.$("#stepOne");
        const html = await page.evaluate(handle => handle.innerText, handle);

        expect(html).toBe("1) Create configuration file: ");
    })
    test("Inspect Logs", async () => {
        
        
        await page.waitForTimeout(10000)
        await page.click("#logs")
        await page.waitForTimeout(1000)
        
        const handle = await page.$("#bag");
        await page.screenshot({ path: 'screenshots/dummyLogs.jpg', type: 'jpeg' });
        const html = await page.evaluate(handle => handle.innerText, handle);

        expect(html).toBe("Validate bag:");
     }, timeout)

     test("Inspect Results", async () => {
        
        await page.waitForTimeout(1000)
        await page.click('#close')
        await page.click("#result")
        
        await page.screenshot({ path: 'screenshots/dummyResult.jpg', type: 'jpeg' });
        const handle = await page.$("#diffCaption");
        const html = await page.evaluate(handle => handle.innerText, handle);

        expect(html).toBe("Differences between original and reproduced results");
     })

    test("Go to Manipulate", async () => {

        await page.waitForTimeout(1000)
        await page.click('#close')
        await page.click('#manipulate')
        await page.waitForTimeout(2000)

        await page.screenshot({ path: 'screenshots/bindingsERCViewManipulate.jpg', type: 'jpeg' });

        const handle = await page.$("#desc");
        const html = await page.evaluate(handle => handle.innerText, handle);

        expect(html).toBe("Minimum distance in miles the car should come with one gallon");
    })

    test("Slider Change", async () => {

        // adapted from https://stackoverflow.com/questions/49772472/how-to-simulate-a-drag-and-drop-action-in-puppeteer
        const dragAndDrop = async (page, originSelector) => {
            await page.waitForSelector(originSelector)
            const origin = await page.$(originSelector)
            const ob = await origin.boundingBox()

            console.log(`Dragging from ${ob.x + ob.width / 2}, ${ob.y + ob.height / 2}`)
            await page.mouse.move(ob.x + ob.width / 2, ob.y + ob.height / 2)
            await page.mouse.down()
            console.log(`Dropping at   ${ob.x + ob.width / 2}, ${ob.y + ob.height / 2}`)
            await page.mouse.move(ob.x + ob.width / 2 + 300, ob.y + ob.height / 2)
            await page.mouse.up()
        }


        await page.click('#saveComparison')
        await dragAndDrop(page, ".MuiSlider-thumb")
        await page.click('#option0')
        await page.click('#saveComparison')
        await page.click('#option1')

        await page.click('#showComparison')

        const handle = await page.$("#caption0");
        const html = await page.evaluate(handle => handle.innerText, handle);

        expect(html).toBe("Parameter 1: minimumMilesPerGallon = 4; Parameter 2: numberOfCylinders = \"all\";");
    })

    test("Go To Metadata", async () => {
        await page.waitForTimeout(1000)
        await page.click('#close')
        await page.waitForTimeout(1000)
        await page.click('#metadata')
        await page.waitForTimeout(2000)
        await page.screenshot({ path: 'screenshots/bindingsMetadata.jpg', type: 'jpeg' });

        const handle = await page.$("#title");
        const html = await page.evaluate(handle => handle.innerText, handle);

        expect(html).toBe("Title: BindingsExample");
    })

    test("Go To Shipment", async () => {
        await page.click('.MuiTabScrollButton-root')
        await page.click('#shipment')
        await page.waitForTimeout(2000)
        await page.screenshot({ path: 'screenshots/bindingsShipment.jpg', type: 'jpeg' });

        const handle = await page.$("#description");
        const html = await page.evaluate(handle => handle.innerText, handle);

        expect(html).toBe("Create new Shipment:");
    })

});
