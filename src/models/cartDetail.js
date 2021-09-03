import mongoose from 'mongoose';
 
const cartDetailSchema = new mongoose.Schema(
    {
        cart: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cart',
            required: true
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
  },
  { timestamps: true },
);
 
const CartDetail = mongoose.model('CartDetail', cartDetailSchema);
 
export default CartDetail;