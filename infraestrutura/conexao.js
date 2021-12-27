const mysql = require('mysql2')
require('dotenv').config()


const conexao = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: process.env.PASSWORDCONEXAO,
    database: 'agenda-petshop'
})

module.exports = conexao
