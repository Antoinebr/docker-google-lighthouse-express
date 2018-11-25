const Test = require('../models/Test');
const moment = require('moment');


/**
 * lookForRecentTest
 * 
 * Search in the DB to see if a test exist in the DB 
 * bewteen now and now-1H
 * @param {string} url 
 * @returns {null || object} return null or an object 
 */
exports.lookForRecentTest = async (url) => {


    const nowMinus1Hour = moment().subtract(moment.duration("01:00:00")).format('Y-M-D H:M:s')

    const recentTest = await Test.findOne({
        where: {
            url,
            createdAt: {
                $gt: nowMinus1Hour,
            }
        },
    });
    
    // if we don't have any valid test we return null 
    if(!recentTest) return recentTest;

    const {report, reportJSON} = recentTest;

    return {
        report,
        reportJSON,
        ok : true
    }; 

}


/**
 * createAtest
 * 
 * @param {object} test 
 */
exports.createAtest = (test) =>{
    
    const {url, type, report, reportJSON} = test;

    Test.create({
        url,
        type,
        report,
        reportJSON,
    })
    .then(r => console.log('[DB] original test saved in DB'))
    .catch(e => console.log('[DB] error when saving the original test in the DB', e))

} 