const Joi = require('joi');
const CustomErrorHandler = require('../../services/CustomErrorHandler');
const { hubSchema } = require('../../validators/serviceValidator');
const { Hub } = require('../../models');
const addHub = async (req, res, next) => {
    const { error } = hubSchema.validate(req.body);
    if (error) {
        return next(error);
    }
    const { hub_name } = req.body;
    try {
        const checkHub = await Hub.exists({ hub_name: hub_name});
        if(checkHub) {
            return next(CustomErrorHandler.alreadyExist(`${hub_name} already exists`));
        }
        const data = await Hub.create({
            hub_name: hub_name
        });
        res.status(201).send({ message: 'hub created successfully', data: data });
    }
    catch (err) {
        return next(err);
    }
};

module.exports = {
    addHub
};

