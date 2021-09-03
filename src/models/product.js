import mongoose from 'mongoose';
 
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: String,
            required: true
        },
        stock: {
            type: Number,
            required: true
        },
        status: {
            type: Boolean,
            required: true
        },
        productType: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductType' },
  },
  { timestamps: true },
);
 
const Product = mongoose.model('Product', productSchema);
 
export default Product;