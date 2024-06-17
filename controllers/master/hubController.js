const CustomErrorHandler = require('../../services/CustomErrorHandler');
const { hubSchema, territoryWiseHubSchema } = require('../../validators/serviceValidator');
const { Hub } = require('../../models');

const addHub = async (req, res, next) => {
    const { error } = hubSchema.validate(req.body);
    if (error) {
        return next(error);
    }
    const { territory_id, hub_name } = req.body;
    try {
        const checkHub = await Hub.findOne({ hub_name: hub_name, territory_id: territory_id }).exec();
        if (checkHub) {
            if (checkHub.flagDelete == true) {
                checkHub.flagDelete = false;
                const updatedHub = await checkHub.save();
                return res.status(200).send({ message: 'Hub recovered successfully', data: updatedHub });
            }
            return next(CustomErrorHandler.alreadyExist(`${hub_name} Already Exists`));
        }
        const hub = new Hub({
            territory_id: territory_id,
            hub_name: hub_name,
        });
        const result = await hub.save();
        if (result) {
            res.status(201).send({ message: 'Hub created successfully', data: result });
        }
    } catch (err) {
        return next(err);
    }
};


const allHub = async (req, res, next) => {
    try {
        const results = await Hub.find({ flagDelete: false })
            .select('-__v -createdAt -updatedAt -flagDelete')
            .populate({
                path: 'territory_id',
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

const singleHub = async (req, res, next) => {
    try {
        const data = await Hub.findOne({ _id: req.params.id }).select('-__v -createdAt -updatedAt -id -flagDelete -id').populate({ path: 'territory_id', select: '-__v -createdAt -updatedAt -flagDelete' });
        if (data) {
            res.status(200).send({ data: data });
        }
        else {
            return next(CustomErrorHandler.dataNotExist('no data found'));
        }
    }
    catch (error) {
        return next(error);
    }
}

const updateHub = async (req, res, next) => {
    const { error } = await hubSchema.validate(req.body);
    if (error) {
        return next(error);
    }
    try {
        const { territory_id, hub_name } = req.body;
        const result = await Hub.findByIdAndUpdate({ _id: req.params.id }, {
            territory_id: territory_id,
            hub_name: hub_name
        }, { new: true });
        if (result) {
            return res.status(200).send({ message: 'data updated successfully', data: result });
        }
    }
    catch (error) {
        return next(error);
    }
}

const deleteHub = async (req, res, next) => {
    try {

        const checkHub = await Hub.exists({ _id: req.params.id });
        if (!checkHub) {
            return next(CustomErrorHandler.dataNotExist('data not found'));
        }
        await Hub.findByIdAndUpdate(req.params.id, { flagDelete: true });
        res.status(200).send({ message: 'data deleted successfully' });
    }
    catch (err) {
        return next(err);
    }
};

const territoryWiseHub = async (req, res, next) => {
    const { error } = await territoryWiseHubSchema.validate(req.body);
    if(error) {
        return next(error);
    }
    const { territory_id } = req.body;
    try {
        const results = await Hub.find({territory_id: territory_id, flagDelete: false, status: 'active'}).select('-__v -createdAt -updatedAt -id -flagDelete -id');
        if(results.length > 0) {
            res.status(200).send({ data: results });
        }
        else {
            return next(CustomErrorHandler.dataNotExist('data not found'));
        }
    }
    catch (err) {
        return next(err);
    }
}




module.exports = {
    addHub,
    allHub,
    singleHub,
    updateHub,
    deleteHub,
    territoryWiseHub
}