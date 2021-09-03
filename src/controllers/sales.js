import mongoose from 'mongoose';
import Cart from '../models/cart';
import CartDetail from '../models/cartDetail';
import Sale from '../models/sale';
import SaleDetail from '../models/saleDetail';
import Product from '../models/product';

import { StatusSales, PaymentMethod} from '../res/globals';

export default class SalesController {

    static async add(req, res, next) {
        let response = null;
        try {
            // Process body data
            const { paymentMethod, address, observation
            } = req.body;
            const user = req.user;

            // Validate user input
            if (!(paymentMethod && address && observation )) {
                throw 'Todos los campos son obligatorios';
            }

            // Validate if exists payment method
            const paymentMethodExist = PaymentMethod.find((pm) => {
                return pm === paymentMethod;
            });
            if (paymentMethodExist === undefined) {
                throw "Método de pago no existe";
            }

            // Get cart
            const cart = await Cart.findOne({ user: mongoose.Types.ObjectId(user.user_id) });
            if (!cart) {
                throw "Carrito no existe";
            }

            // Get cart detail
            const cartDetail = await CartDetail.find({
                cart: mongoose.Types.ObjectId(cart._id)
            }).populate('product',{price:1});
            if (!cartDetail) {
                throw "Detalle de carrito no existe";
            }

            // Calc total sale
            let total = 0.0;
            cartDetail.forEach((detail) => {
                total += detail.quantity * parseFloat(detail.product.price);
            });
           
            // Create sale
            const sale = new Sale({
                paymentMethod: paymentMethodExist,
                status: StatusSales['approved'],
                total: total,
                subTotal: total,
                discount: 0,
                address: address,
                observation: observation,
                user: mongoose.Types.ObjectId(user.user_id),
            });
            await sale.save();
            
            // Create sale details
            cartDetail.forEach( async (detail) => {
                const saleDetail = new SaleDetail({
                    quantity: detail.quantity,
                    price: detail.product.price,
                    product: mongoose.Types.ObjectId(detail.product._id),
                    sale: mongoose.Types.ObjectId(sale._id),
                });
                await saleDetail.save();
            });

            // Update stock in products
            cartDetail.forEach(async (detail) => {
                const product = await Product.findOne({ _id: detail.product._id });
                product.stock = product.stock - detail.quantity;
                await product.save();
            });

            // Remove detail cart and cart
            await CartDetail.deleteMany({ cart: cart._id });
            await Cart.deleteOne({ _id: cart._id }); 

            response = {
                'status': {
                    'code': 0,
                    'message': 'ok'
                }
            };
            res.status(200).json(response);

        } catch (e) {
            console.log(e);
            response = {
                'status': {
                    'code': 1,
                    'message': `Error al crear venta. ${e}`
                }
            };
            res.status(200).json(response);
        }
    }

    static async getAll(req, res, next) {
        let response = null;
        try {
            const user = req.user;

            // Get sales
            let sales = await Sale.find({ user: mongoose.Types.ObjectId(user.user_id) }).select({'user':0});
            sales = JSON.parse(JSON.stringify(sales));

            // Get details of sales
            for (let i = 0; i < sales.length; i++) {
                const sale = sales[i];
                const detail = await SaleDetail.find({
                    sale: mongoose.Types.ObjectId(sale._id)
                }).select({'sale':0, 'createdAt':0,'updatedAt':0}).populate('product', { 'name': 1 });
                sales[i]['detail'] = detail;
            }
           
            if (sales) {
                response = {
                    'status': {
                        'code': 0,
                        'message': 'ok'
                    },
                    'sales': sales
                };
                return res.status(200).send(response);
            } else {
                throw 'No existen ventas';
            }

        } catch (e) {
            console.log(e);
            response = {
                'status': {
                    'code': 1,
                    'message': `Error al obtener ventas. ${e}`
                },
                'sales': []
            };
            res.status(200).json(response);
        }
    } 
}