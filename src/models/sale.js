import mongoose from 'mongoose';


const saleSchema = new mongoose.Schema(
    {
        paymentMethod: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        },
        total: {
            type: String,
            required: true
        },
        subTotal: {
            type: String,
            required: true
        },
        discount: {
            type: Number,
            required: false,
            default: 0
        },
        address: {
            type: String,
            required: true
        },
        observation: {
            type: String,
            required: true
        },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

const Sale = mongoose.model('Sale', saleSchema);
 
export default Sale;