const dotenv = require('dotenv');
dotenv.config();

const { APP_PORT, DEBUG_MODE, DB_URL } = process.env;

module.exports = {
    APP_PORT,
    DEBUG_MODE,
    DB_URL
};
