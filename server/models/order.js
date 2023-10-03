const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  items: [
    {
      product: { type: Object, required: true },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  delivery: {
    type: String,
    required: true,
    default: 'Waiting for progressing',
  },
  status: {
    type: String,
    required: true,
    default: 'Waiting for pay',
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  orderTime: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});

module.exports = mongoose.model('Order', orderSchema);
