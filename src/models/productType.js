import mongoose from 'mongoose';
 
const productTypeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true,
        }
  }
);
 
const ProductType = mongoose.model('ProductType', productTypeSchema);
 
export default ProductType;