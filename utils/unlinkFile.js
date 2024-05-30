const fs = require('fs');
const CustomErrorHandler = require('../services/CustomErrorHandler');

const unlinkFile = (filePath, next) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            next(CustomErrorHandler.serverError());
        }
    });
};
module.exports = { unlinkFile };
