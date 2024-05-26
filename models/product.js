const { required } = require('joi');
const mongoose = require('mongoose');
// const ProductMedia = require('./productMedia');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    product_name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        default: 'male'
    },
    description: {
        type: String,
        default: null
    },
    image: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    // productMedia: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'ProductMedia'
    // }]
    //productMedia: [{ type: Schema.Types.ObjectId, ref: 'ProductMedia' }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema, 'products');