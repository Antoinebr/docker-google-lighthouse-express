const express = require('express');
const bodyParser = require('body-parser');
const ligthHouseCtrl = require('./controllers/lightouse');
const reportCtrl = require('./controllers/reportCtrl')
const cors = require('cors');


const app = express();

// enable cors
app.use(cors());

//Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));


// router 
app.post("/runtest", ligthHouseCtrl.validateParams, ligthHouseCtrl.mocking, ligthHouseCtrl.runTests);
app.post("/runOriginalTest", ligthHouseCtrl.validateParams, ligthHouseCtrl.runOriginalTest);
app.get('/report/', reportCtrl.getReport);
app.get('/reports/', reportCtrl.getAllReports);


module.exports = app;

