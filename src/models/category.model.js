const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          // Simple regex to validate if the string is a URL
          return /^(http|https):\/\/[^ "]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid image URL!`,
      },
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    isActive: {
      type: Boolean,
      required: false,
      default: true,
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    isDeleted: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);
categorySchema.index({ slug: 1, name: 1 });

/**
 * @typedef Product
 */
const Product = mongoose.model('Category', categorySchema);

module.exports = Product;
