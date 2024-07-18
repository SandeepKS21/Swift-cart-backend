const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const productSchema = mongoose.Schema(
  {
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: false,
      required: false,
    },
    coverImg: {
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
      required: false,
      default: '',
    },
    images: [
      {
        type: String,
        validate: {
          validator: function (v) {
            return /^(http|https):\/\/[^ "]+$/.test(v);
          },
          message: (props) => `${props.value} is not a valid image URL!`,
        },
      },
    ],
    originalPrice: {
      type: Number,
      required: true,
      min: [0, 'Original price must be a positive number'],
    },
    discountPrice: {
      type: Number,
      required: true,
      min: [0, 'Discount price must be a positive number'],
      validate: {
        validator: function (value) {
          return value <= this.originalPrice;
        },
        message: 'Discount price must be less than or equal to the original price.',
      },
    },
    rating: {
      type: Number,
      required: false,
      default: 4,
    },
    isDeleted: {
      type: Boolean,
      required: false,
      default: false,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    isPopular: {
      type: Boolean,
      required: false,
      default: false,
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: [0, 'Stock quantity must be a positive number'],
    },
    SKU: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

/**
 * @typedef Product
 */
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
