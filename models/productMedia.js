const { required, string } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productMediaSchema = new Schema({
    product_id: {
        type: Schema.Types.ObjectId, // Change type to ObjectId
        ref: 'Product', // Reference to Product model
        //default: null
    },
    image: {
        type: String,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('ProductMedia', productMediaSchema, 'product_media');