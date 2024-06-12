const mongoose = require('mongoose');
const { APP_URL } = require('../config');
const Schema = mongoose.Schema;

const VendorSchema = new Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  vendor_category_id: {
    type: Schema.Types.ObjectId,
    ref: 'VendorCategory',
    required: true
  },
  hub_id: {
    type: Schema.Types.ObjectId,
    // ref: 'Hub',
    // required: false
  },
  territory_id: {
    type: Schema.Types.ObjectId,
    // ref: 'Territory',
    // required: false
  },
  vendor_owner: {
    type: String,
    required: true
  },
  outlets_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  service_gender: {
    type: String,
    enum: ['male', 'female', 'both'],
    default: 'both'
  },
  address: {
    type: String,
    required: true
  },
  landmark: {
    type: String,
    required: true
  },
  latitude: {
    type: String,
    required: true
  },
  longitude: {
    type: String,
    required: true
  },
  pin_code: {
    type: Number,
    required: true
  },
  logo: {
    type: String,
    default: null,
    get: (logo) => {
      return logo ? `${APP_URL}/uploads/${logo}` : null;
    }
  },
  thumbnail: {
    type: String,
    default: null,
    get: (thumbnail) => {
      return thumbnail ? `${APP_URL}/uploads/${thumbnail}` : null;
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  deleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Vendor', VendorSchema, 'vendors');
