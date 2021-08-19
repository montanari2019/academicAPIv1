const { Sequelize } = require('sequelize')
const databaseconfig = require('../config/database') 

const Associacao = require('../app/models/Associacao')
const DadosBancarios = require('../app/models/DadoBancario')
const User = require('../app/models/User')
const Faculdade = require('../app/models/Faculdade')

const connection = new Sequelize(databaseconfig)

Associacao.init(connection)

DadosBancarios.init(connection)
DadosBancarios.associate(connection.models)

User.init(connection)
User.associate(connection.models)

Faculdade.init(connection)
Faculdade.associate(connection.models)

module.exports = connection