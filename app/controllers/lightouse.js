const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator');

const {
    URL
} = require('url');

const validator = require('validator');
const utils = require('../utils/utils');
const fs = require('fs');



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
                "report": "www.random.net_2018-11-24__17-04-47.original.report.html",
                "reportJSON": "www.random.net_2018-11-24__17-04-47.original.report.json"
            },
            "blockedTestResult": {
                "ok": true,
                "report": "www.random.net_2018-11-24__17-04-47.blocked.report.html",
                "reportJSON": "www.random.net_2018-11-24__17-04-47.blocked.report.json"
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
 * @name launchChromeAndRunLighthouse
 * @description start a Google Chrome insta,ce and run LightHouse 
 * @param {string} url 
 * @param {object} opts 
 * @param {object} config 
 */
const launchChromeAndRunLighthouse = async (url, opts, budgets = null) => {
    
    config = {
        extends: 'lighthouse:default',
        settings: {
          budgets,
        },
      };

    const chrome = await chromeLauncher.launch({
        chromeFlags: opts.chromeFlags
    });
    
    opts.port = chrome.port; 

    const results = await lighthouse(url, opts, config);

    await chrome.kill();
    

    // use results.lhr for the JS-consumeable output
    // https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
    // use results.report for the HTML/JSON/CSV output as a string
    // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
            
    return results;

}


/**
 * @name runLightHouseTest
 * @param {string} url 
 * @param {array} blockedUrlPatterns 
 */
const runLightHouseTest = async (url, blockedUrlPatterns = [], budget = null) => {

    // if blockedUrlPatterns contains items
    const suffix = blockedUrlPatterns.length === 0 ? ".original" : ".blocked";

    const options = {
        blockedUrlPatterns,
        chromeFlags: ['--no-sandbox', '--headless', '--disable-gpu','--max-wait-for-load 20000']
    };


    const status = {};

    try {

        const results = await launchChromeAndRunLighthouse(url, options,budget);

        // we create the HTML 
        const html = ReportGenerator.generateReport(results.lhr, 'html')

        status.ok = true;

        // save the oupiut in process.env.REPORTS_PATH
        
        // we create the report names
        const htmlName = createReportName(url,`${suffix}.html`)
        const jsonName = createReportName(url,`${suffix}.json`);

        // Let's save the files 
        fs.writeFileSync(`${process.env.REPORTS_PATH}${jsonName}`,results.report);
        fs.writeFileSync(`${process.env.REPORTS_PATH}${htmlName}`,html);

        status.report = htmlName;
        status.reportJSON = jsonName;

    } catch (error) {

        status.ok = false;
        status.message = error.toString();

        utils.dumpError(error);

    }

    return status;

};



/**
 * @name runOriginalTest
 * @description Runs a LightHouse test to be used as a reference
 */
exports.runOriginalTest = async (req, res) => {

    // get the url 
    const {
        url,
        budgets
    } = req.body;


    console.log(`[LightHouse] ${utils.now()} starting the tests....`);

    try {

        const originalTestResult = await runLightHouseTest(url,[],budgets);

        console.log(`[LightHouse] ${utils.now()} Tests finished`)

        if( !originalTestResult.ok ){
            return res.status(500).json(originalTestResult)
        }

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

 
    console.log(`[LightHouse] ${utils.now()} starting the tests....`);


    try {

        const originalTestResult = await runLightHouseTest(url);

        const blockedTestResult = await runLightHouseTest(url, blockedRequests);

        // even if originalTest is an object and not a Promise it will resolve
        //const [originalTestResult, blockedTestResult] = await Promise.all([originalTest, blockedTest]);

        if (!originalTestResult.ok) throw new Error(originalTestResult.message)

        if (!blockedTestResult.ok) throw new Error(blockedTestResult.message)


        console.log(`[LightHouse] ${utils.now()} Tests finished`)

        return res.json({
            originalTestResult,
            blockedTestResult
        });

    } catch (error) {

        console.log(`[LightHouse] ${utils.now()} Something wrong happpend ${error}`)

        utils.dumpError(error);

        return res.status(500).send(error.toString());
    }



}