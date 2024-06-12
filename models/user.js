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
    enum: ['CUSTOMER', 'ADMIN', 'VENDOR', 'WORKER'],
    default: 'CUSTOMER'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'block'],
    default: 'active'
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'transgender'],
    default: 'male'
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
  deleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

userSchema.virtual('vendor', {
  ref: 'Vendor',
  localField: '_id',
  foreignField: 'user_id',
  justOne: true
});
userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema, 'users');
