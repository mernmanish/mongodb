const mongoose = require('mongoose');
const {APP_URL} = require('../config');
const Schema = mongoose.Schema;
const HubSchema = new Schema({
    hub_name: {
        type: String,
        unique: true,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    deleted: {
        type: Boolean,
        default: false,
    },
},{timestamps: true, toJSON: { getters: true }});

  HubSchema.pre('find', function() {
    this.where({ deleted: { $ne: true } });
  });
  
  HubSchema.pre('findOne', function() {
    this.where({ deleted: { $ne: true } });
  });
  
  HubSchema.statics.findNotDeleted = function() {
    return this.find({ deleted: { $ne: true } });
  };
module.exports = mongoose.model('Hub',HubSchema,'hubs');