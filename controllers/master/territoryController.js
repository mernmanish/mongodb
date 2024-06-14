const Joi = require('joi');
const CustomErrorHandler = require('../../services/CustomErrorHandler');
const { territorySchema } = require('../../validators/serviceValidator');
const { Territory } = require('../../models');

const addTerritory = async (req, res, next) => {
    const { error } = territorySchema.validate(req.body);
    if (error) {
        return next(error);
    }

    const { territory_name } = req.body;
    try {
        const existingTerritory = await Territory.findOne({ territory_name }).exec();
        if (existingTerritory) {
            if(existingTerritory.flagDelete == true)
            {
                existingTerritory.flagDelete = false;
                const updatedTerritory = await existingTerritory.save();
                return res.status(200).send({ message: 'Territory recovered successfully', data: updatedTerritory });
            }
            return next(CustomErrorHandler.alreadyExist(`${territory_name} already exists`));
        }
        const newHub = new Territory({
            territory_name
        });
        const result = await newHub.save();
        res.status(201).send({ message: 'Territory created successfully', data: result });
    } catch (err) {
        return next(err);
    }
};


const allTerritory = async (req, res, next) => {
    try {
        const results = await Territory.find({flagDelete: false}).select('-__v -createdAt -updatedAt -id');
        if (results.length == 0) {
            return next(CustomErrorHandler.dataNotExist('no data found'));
        }
        res.status(200).send({ data: results });
    }
    catch (err) {
        return next(err);
    }
}

const singleTerritory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await Territory.findOne({ _id: id }).select('-__v -createdAt -updatedAt -deleted -id');
        if (!result) {
            return next(CustomErrorHandler.dataNotExist('no data found'));
        }
        res.status(200).send({ data: result });
    }
    catch (err) {
        return next(err);
    }
};

const updateTerritory = async (req, res, next) => {
    const { error } = territorySchema.validate(req.body);
    if (error) {
        return next(error);
    }
    const { territory_name } = req.body;
    try {
        const result = await Territory.findByIdAndUpdate({ _id: req.params.id }, {
            territory_name
        }, { new: true })
        if (result) {
            res.status(200).send({ message: 'Territory updated successfully', data: result });
        }
    }
    catch (err) {
        return next(err);
    }
}

const deleteTerritory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const checkTerritory = await Territory.exists({ _id: req.params.id });
        if (!checkTerritory) {
            return next(CustomErrorHandler.dataNotExist('data not found'));
        }
        await Territory.findByIdAndUpdate(id, { flagDelete: true });
        res.status(200).json({ message: 'Territory deleted successfully' });
    }
    catch (err) {
        return next(err);
    }
}

module.exports = {
    addTerritory,
    allTerritory,
    singleTerritory,
    updateTerritory,
    deleteTerritory
};

