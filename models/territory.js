const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TerritorySchema = new Schema({
    territory_name: {
        type: String,
        unique: true,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    flagDelete: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true, toJSON: { getters: true } });

TerritorySchema.virtual('Territory', {
    ref: 'territory',
    localField: '_id',
    foreignField: 'territory_id',
    justOne: true
});

TerritorySchema.set('toObject', { virtuals: false });
TerritorySchema.set('toJSON', { virtuals: false });

module.exports = mongoose.model('Territory', TerritorySchema, 'territories');
