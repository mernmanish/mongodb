const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HubSchema = new Schema({
    territory_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Territory',
        required: true
    },
    hub_name: {
        type: String,
        unique: false,
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

HubSchema.set('toObject', { virtuals: false });
HubSchema.set('toJSON', {
    versionKey: true,
    transform: function (doc, ret) {
        ret.territory = ret.territory_id; // Embed hub_id under hub
        delete ret.territory_id; // territory_id hub_id field
    }
});

module.exports = mongoose.model('Hub', HubSchema, 'hubs');
