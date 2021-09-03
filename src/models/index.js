import mongoose from 'mongoose';
 
import User from './user';
import Role from './role';
import Product from './product';
import ProductType from './productType';
import Cart from './cart';
import CartDetail from './cartDetail';
import Sale from './sale';
import SaleDetail from './saleDetail';

const connectDb = () => {
  return mongoose.connect(process.env.DATABASE_URL);
};
 
const models = { User, Role, Product, ProductType, Cart, CartDetail, Sale, SaleDetail };
 
export { connectDb };
 
export default models;