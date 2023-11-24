const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'table_test',
    password: 'postgres',
    port: 5432,
})

const getAll = (request, response) => {
    pool.query('SELECT * FROM table_test;', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

module.exports = {
    getAll

}