module.exports = {
    preset: "jest-puppeteer",
    globals: {
        URL: "http://localhost"
    },
    testMatch: [
        "**/src/test/**/*.test.js"
    ],
    verbose: true
}
