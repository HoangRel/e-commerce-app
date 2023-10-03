const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
  role: {
    type: String,
    default: 'CLIENT',
    required: true,
  },
});

userSchema.methods.addCart = function (product, quantity) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });

  let newQuantity = quantity;
  const updateCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + quantity;
    updateCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updateCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }

  this.cart.items = updateCartItems;
  return this.save();
};

//

userSchema.methods.updateQty = function (prodId, quantity) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === prodId.toString();
  });

  const updateCartItems = [...this.cart.items];

  updateCartItems[cartProductIndex].quantity = quantity;

  this.cart.items = updateCartItems;
  return this.save();
};

//

userSchema.methods.removeFromCart = function (prodId) {
  const updateCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== prodId.toString();
  });

  this.cart.items = updateCartItems;
  return this.save();
};

//

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
