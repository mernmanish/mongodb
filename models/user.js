const { required, string } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
      name: {
        type: String,
        required:true
      },
      email: {
        type: String,
        required:true,
        unique: true
      },
      mobile: {
        type: Number,
        required:true
      },
      password: {
        type: String,
        required:true
      },
      role: {
        type: String,
        default: 'CUSTOMER'
      }
},{timestamps:true});

module.exports = mongoose.model('User', userSchema, 'users');
