const { DEBUG_MODE } = require('../config');
const { ValidationError } = require('joi');
const CustomErrorHandler = require('../services/CustomErrorHandler');

const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let data = {
        message: "Internal Server Error",
        ...(DEBUG_MODE === 'true' && { originalError: err.message })
    };

    if (err instanceof Error) {
        if (err instanceof ValidationError) {
            statusCode = 422;
            data = {
                message: err.message
            };
        } else if (err instanceof CustomErrorHandler) {
            statusCode = err.status;
            data = {
                message: err.message
            };
        }
    }

    return res.status(statusCode).json(data);
}

module.exports = errorHandler;
