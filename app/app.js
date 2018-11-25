const express = require('express');
const bodyParser = require('body-parser');
const ligthHouseCtrl = require('./controllers/lightouse');
const reportCtrl = require('./controllers/reportCtrl')
const cors = require('cors');
require('./init');

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

// let's run the server 
app.set('port', process.env.PORT || 3498);

const server = app.listen(app.get('port'), () => {
    console.log(`Express running → PORT ${server.address().port}`);
});