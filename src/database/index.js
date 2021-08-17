const { Sequelize } = require('sequelize')
const databaseconfig = require('../config/database') 

const Associacao = require('../app/models/Associacao')


const connection = new Sequelize(databaseconfig)

Associacao.init(connection)


module.exports = connection