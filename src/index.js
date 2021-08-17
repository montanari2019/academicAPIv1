require('dotenv').config()

const express = require('express');
const routes = require('./routes');
const morgan = require('morgan');
const cors = require('cors');

require('./database/index')

const app = express();

app.use(express.json())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(routes)

const port = 3236

app.listen(process.env.PORT || port, () => { 
    console.log(`Servidor rodando na porta ${port}`)
})