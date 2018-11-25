const Sequelize = require('sequelize');
const sequelize = require('../init')


const Test = sequelize.define('tests', {
    url: {
        type: Sequelize.STRING,
        allowNull: false 
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false 
    },
    report: {
        type: Sequelize.STRING,
        allowNull: false 
    },
    reportJSON: {
        type: Sequelize.TEXT,
        allowNull: false 
    }
});


module.exports = Test;