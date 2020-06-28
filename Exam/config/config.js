const dbname = 'theaters'
const dbuser = 'user'
const dbpass = process.env.DB_PASSWORD
module.exports = {
    development: {
        port: process.env.PORT || 3000,
        databaseUrl: `mongodb+srv://${dbuser}:${dbpass}@softuni-bhvuj.mongodb.net/${dbname}?retryWrites=true&w=majority`
    },
    production: {}
};