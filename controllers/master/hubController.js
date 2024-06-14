const CustomErrorHandler = require('../../services/CustomErrorHandler');
const { hubSchema } = require('../../validators/serviceValidator');
const { Territory } = require('../../models');

const addTerritory = async (req, res, next) => {
    const { error } = hubSchema.validate(req.body);
    if (error) {
        return next(error);
    }
    const { hub_id, territory_name } = req.body;
    try {
        const checkTerritory = await Territory.findOne({ territory_name: territory_name, hub_id: hub_id }).exec();
        if (checkTerritory) {
            if (checkTerritory.flagDelete == true) {
                checkTerritory.flagDelete = false;
                const updatedTerritory = await checkTerritory.save();
                return res.status(200).send({ message: 'Territory recovered successfully', data: updatedTerritory });
            }
            return next(CustomErrorHandler.alreadyExist(`${territory_name} Already Exists`));
        }
        const territory = new Territory({
            hub_id: hub_id,
            territory_name: territory_name,
        });
        const result = await territory.save();
        if (result) {
            res.status(201).send({ message: 'Territory created successfully', data: result });
        }
    } catch (err) {
        return next(err);
    }
};


const allTerritory = async (req, res, next) => {
    try {
        const results = await Territory.find({ status: 'active' })
            .select('-__v -createdAt -updatedAt -id -flagDelete -id')
            .populate({
                path: 'hub_id',  // Populate the 'hub_id' field in Territory
                select: '-__v -createdAt -updatedAt -flagDelete'
            })
            .exec();

        if (results.length == 0) {
            return next(CustomErrorHandler.dataNotExist('no data found'));
        }
        res.status(200).send({ data: results });
    } catch (err) {
        return next(err);
    }
};





module.exports = {
    addTerritory,
    allTerritory
}