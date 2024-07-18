const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    transactionType: {
      type: String,
      required: true,
      enum: ['Payment', 'Refund'],
      default: 'Payment',
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending',
    },
    paymentMethod: { type: String, required: true },
    transactionId: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
