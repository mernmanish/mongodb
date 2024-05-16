const { required, string } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobile: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['CUSTOMER', 'ADMIN', 'MODERATOR', 'WORKER'],
    default: 'CUSTOMER'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'block'],
    default: 'active'
  },
  gender: {
    type: String,
    default: null
  },
  profile_image: {
    type: String,
    default: null
  },
  latitude: {
    type: String,
    default: null
  },
  longitude: {
    type: String,
    default: null
  },
  deleteAt: {
    type: Date,
    default: null
  },

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema, 'users');
