const { required } = require('joi');
const mongoose = require('mongoose');

const orderItemSchame = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  priceAtPurchase: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  productSnapshot: {
    name: { type: String, required: true },
    coverImg: { type: String, required: true },
    description: { type: String, required: true },
    SKU: { type: String, required: true },
    slug: { type: String, required: true },
  },
});

const orderSchema = mongoose.Schema(
  {
    orderId: {
      type: Number,
      // unique: true,
      default: 634,
      index: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    item: [orderItemSchame],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ['Pending Payment', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending Payment',
    },

    shippingAddress: {
      address: {
        type: String,
        required: true,
        trim: true,
      },
      type: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      pinCode: {
        type: Number,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
    },

    shippingDateTime: {
      shippingDate: {
        type: String,
        required: false,
        default: 'Sun 31 Mar, 2024 ',
      },
      shippingTime: {
        type: String,
        required: false,
        default: '12:25 pm ',
      },
    },
  },
  {
    timestamps: true,
  }
);

// auto increment orderId by 1
// orderSchema.pre('save', async function (next) {
//   if (this.isNew) {
//     const lastOrder = await this.constructor.findOne({}).sort('-orderId'); // Ensure sorting is correct
//     this.orderId = lastOrder ? lastOrder.orderId + 1 : 1;
//   }
//   next();
// });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
