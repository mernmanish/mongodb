const { required } = require('joi');
const mongoose = require('mongoose');
const {APP_URL} = require('../config');
const Schema = mongoose.Schema;
const VendorCategorySchema = new Schema({
    category_name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: null,
        get: (image) => {
          return `${APP_URL}/uploads/${image}`;
        }
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

  VendorCategorySchema.pre('find', function() {
    this.where({ deleted: { $ne: true } });
  });
  
  VendorCategorySchema.pre('findOne', function() {
    this.where({ deleted: { $ne: true } });
  });
  
  VendorCategorySchema.statics.findNotDeleted = function() {
    return this.find({ deleted: { $ne: true } });
  };
module.exports = mongoose.model('VendorCategory',VendorCategorySchema,'vendor_categories');