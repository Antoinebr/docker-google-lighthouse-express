const {
    exec
} = require('child_process');

const {
    promisify
} = require('util');

const execPromise = promisify(exec);

const {
    URL
} = require('url');

const validator = require('validator');
const utils = require('../utils/utils');
const Test = require('../models/Test');
const testCtrl = require('../controllers/testCtrl')



/**
 * validateParams
 * 
 * Express middleware to validate the params
 */
exports.validateParams = (req, res, next) => {

    const {
        url
    } = req.body;

    // Validate params
    if (!url) {
        return res.status(400).send('400 : Missformed request ! Url param is missing');
    }

    if (!validator.isURL(url)) {
        return res.status(400).send('400 : Missformed request ! url is not a valid');
    }

    return next();
}

/**
 * mocking 
 * 
 * Express middleware to mock the request and speedup dev time
 */
exports.mocking = (req, res, next) => {

    const {
        mocked
    } = req.body;

    if (mocked) {

        return res.json({
            "originalTestResult": {
                "ok": true,
                "report": "www.activis.net_2018-11-24__17-04-47.original.report.html",
                "reportJSON": "www.activis.net_2018-11-24__17-04-47.original.report.json"
            },
            "blockedTestResult": {
                "ok": true,
                "report": "www.activis.net_2018-11-24__17-04-47.blocked.report.html",
                "reportJSON": "www.activis.net_2018-11-24__17-04-47.blocked.report.json"
            }
        });
    }

    return next();
}


/**
 * createReportName
 * 
 * @param {string} url 
 * @param {string} suffix optional
 */
const createReportName = (url, suffix = "") => {

    const myURL = new URL(url);

    return `${myURL.host}_${new Date().toJSON().replace('T','__').replace(':','-').replace(':','-').slice(0,20)}${suffix}`;
}


/**
 * runLightHouseTest
 * 
 * @param {string} url 
 * @param {string} flags 
 */
const runLightHouseTest = async (url, flags = "") => {

    const suffix = flags === "" ? ".original" : ".blocked";

    const responseFromDocker = await execPromise(`lighthouse --enable-error-reporting --chrome-flags="--no-sandbox --headless --disable-gpu" ${url} --output-path=/home/chrome/reports/${createReportName(url,suffix)} --output json --output html ${flags} `);

    const status = {};

    const match = responseFromDocker.stderr.match("\/home\/.*.html")[0];

    if (match) {
        status.ok = true;
        status.report = match.replace('/home/chrome/reports/', '');
        status.reportJSON = status.report.replace('.html', '.json');

    } else {
        status.ok = false;
        status.message = responseFromDocker;
    }

    return status;
};



/**
 * runOriginalTest
 * 
 * Runs a LightHouse test to be used as a reference
 */
exports.runOriginalTest = async (req, res) => {

    // get the url 
    const {
        url
    } = req.body;

    console.log(`[LightHouse] ${utils.now()} starting the tests....`);

    try {

        // look for a recent test 
        let originalTest = null;

        const recentTest = await testCtrl.lookForRecentTest(url).catch(e => {
            console.log('[DB] error when checking the recent test in the DB', e);
        });

        // if there's a recent test we put it in originalTest variable
        if (recentTest) originalTest = recentTest;
        // if there's NO recent test we put a promise in originalTest variable
        else originalTest = runLightHouseTest(url);

        const originalTestResult = await originalTest;

        // save the res in the db 
        if (!recentTest) {
            testCtrl.createAtest({
                url,
                type: "original",
                report: originalTestResult.report,
                reportJSON: originalTestResult.reportJSON
            });

        }

        console.log(`[LightHouse] ${utils.now()} Tests finished`)

        return res.json({
            originalTestResult
        });

    } catch (error) {

        console.log(`[LightHouse] ${utils.now()} Something wrong happpend ${error}`)

        return res.status(500).send(error.toString());
    }


}



exports.runTests = async (req, res) => {

    const {
        url,
        blockedRequests,
    } = req.body;

    let flags = "";

    if (blockedRequests) {
        flags = blockedRequests.map(e => `--blocked-url-patterns=${e}`).join(' ');
    }

    console.log(`[LightHouse] ${utils.now()} starting the tests....`);


    /*
    Test if the original LightHouse test exists in the DB 
    Check if the test is recent ( 1H )
    */
    let originalTest = null;

    const recentTest = await testCtrl.lookForRecentTest(url).catch(e => {
        console.log('[DB] error when checking the recent test in the DB', e);
    });


    if (recentTest) originalTest = recentTest;
    else originalTest = runLightHouseTest(url);


    const blockedTest = runLightHouseTest(url, flags);

    try {

        // even if originalTest is an object and not a Promise it will resolve
        const [originalTestResult, blockedTestResult] = await Promise.all([originalTest, blockedTest]);

        if (!originalTestResult.ok) throw new Error(originalTestResult.message)

        if (!blockedTestResult.ok) throw new Error(blockedTestResult.message)


        // store the original test in the db only if it's a brand new test 
        if (!recentTest) {

            testCtrl.createAtest({
                url,
                type: "original",
                report: originalTestResult.report,
                reportJSON: originalTestResult.reportJSON
            });

        }


        console.log(`[LightHouse] ${utils.now()} Tests finished`)

        return res.json({
            originalTestResult,
            blockedTestResult
        });

    } catch (error) {

        console.log(`[LightHouse] ${utils.now()} Something wrong happpend ${error}`)

        return res.status(500).send(error.toString());
    }



}