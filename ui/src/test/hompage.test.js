const timeout = 10000;

beforeAll(async () => {
    await page.goto(URL, { waitUntil: "domcontentloaded" });
});

describe("Test title and header of the homepage", () => {
    test("Title of the page", async () => {
        const title = await page.title();

        expect(title).toBe("Home | o2r Demoserver");
    }, timeout);

    test("Header of the page", async () => {
        await page.screenshot({ path: 'screenshots/startPage.jpg', type: 'jpeg', fullPage: true });
        const h1Handle = await page.$("h1");
        const html = await page.evaluate(h1Handle => h1Handle.innerHTML, h1Handle);

        expect(html).toBe("Create your own Executable Research Compendium (ERC)");
    }, timeout);
});