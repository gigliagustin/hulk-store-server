import mongoose from 'mongoose';
 
const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
  },
  { timestamps: true },
);
 
const Cart = mongoose.model('Cart', cartSchema);
 
export default Cart;