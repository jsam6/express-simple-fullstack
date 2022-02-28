const mysql = require('mysql')
const dotenv = require('dotenv')

dotenv.config()

const connection =  mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
})

connection.connect( (err) => {
    if (err) {
        console.log(err.message)
    }
    console.log('db : ' + connection.state)
})

let instance = null;
class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService()
    }

    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                // const query = "SELECT * FROM names WHERE id = ?"
                // connection.query(query, [id])

                const query = "SELECT * FROM names"
                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message))
                    resolve(results)
                })
            })
            console.log(response)
            return response
        } catch (err) {
            console.log(err)
        }
    }

    
    async insertNewName(name) {
        try {
            const dateAdded = new Date();
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO names (name, date_added) VALUES (?,?);";

                connection.query(query, [name, dateAdded] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve();
                })
            });
            return {
                id : insertId,
                name : name,
                dateAdded : dateAdded
            };
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = DbService;