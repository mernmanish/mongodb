const { required, string, ref } = require("joi");
const mongoose = require("mongoose");
//const Product = required("./product");
const Schema = mongoose.Schema;

const productMediaSchema = new Schema({
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    image: {
        type: String,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('ProductMedia', productMediaSchema, 'product_media');