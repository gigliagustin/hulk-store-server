import mongoose from 'mongoose';
 
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: { type: String },
        name: {
            type: String,
            required: true
        },
        surname: {
            type: String,
            required: true
        },
        status: {
            type: Boolean,
            required: true
        },
        token: { type: String },
        role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
  },
  { timestamps: true },
);
 
const User = mongoose.model('User', userSchema);
 
export default User;