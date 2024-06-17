const { required } = require('joi');
const mongoose = require('mongoose');
const {APP_URL} = require('../config');
const Schema = mongoose.Schema;
const ProductTagSchema = new Schema({
    tag_name: {
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
    flagDelete: {
        type: Boolean,
        default: false
    }
},{timestamps: true, toJSON: { getters: true }});

module.exports = mongoose.model('ProductTag',ProductTagSchema,'product_tags');