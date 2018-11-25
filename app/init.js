const Sequelize = require('sequelize');

// import environmental variables from our variables.env file
// require('dotenv').config({ path: 'variables.env' });

// console.log('PROCESS ENV', process.env);

// Setup the Database 
const Op = Sequelize.Op;
const sequelize = new Sequelize('lighthouse_service', 'root', process.env.MYSQL_ENV_MYSQL_ROOT_PASSWORD, {
  host: 'mysql',
  //port: process.env.DB_PORT,
  dialect: 'mysql',
  pool: {
    max: 50,
    min: 0,
    idle: 10000
  },
  operatorsAliases: {
    $gt: Op.gt,
    $lt: Op.lt
  }
});



const connect = async () => {

  await sequelize.authenticate();

  require('./models/Test');
  // Let's create the table if they don't exist yet
  await sequelize.sync();
  //await sequelize.sync({ force: true })
  console.log('Connected to the DB')
}



connect()
  .catch((err) => {

    console.log(err);
    console.log('Retry to connect in 10sec...')

    // if we try to connect before the DB is fully init
    // we wait 10 sec and connect 
    setTimeout( () => connect(), 10000);
    
  });


module.exports = sequelize;