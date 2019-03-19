require('dotenv').config({
    path: 'variables.env'
});

const app = require('./app');


// let's run the server 
app.set('port', process.env.PORT || 3498);

const server = app.listen(app.get('port'), () => {
    console.log(`Express running → PORT ${server.address().port}`);
});