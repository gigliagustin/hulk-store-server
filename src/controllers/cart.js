import mongoose from 'mongoose';
import Cart from '../models/cart';
import CartDetail from '../models/cartDetail';
import Product from '../models/product';

export default class CartController {

    static async add(req, res, next) {
        try {
            // Process body data
            const { productId, quantity
            } = req.body;
            const user = req.user;

            // Validate user input
            if (!(productId && quantity)) {
                throw "Todos los campos son obligatorios";
            }

            // Get product and check stock 
            const product = await Product.findOne({_id: productId});
            if (product) {
                if (product.stock < quantity) {
                    throw "Stock no disponible";
                }
            } else {
                throw "Producto no encontrado";
            }

            // Validate if cart exist for user in our database
            let cart = await Cart.findOne({ user: mongoose.Types.ObjectId(user.user_id) });
            if (!cart) {
                cart = new Cart({
                    user: mongoose.Types.ObjectId(user.user_id)
                });
                await cart.save();
            }
            
            // Validate if product already exist in the cart
            let cartDetail = await CartDetail.findOne({
                cart: mongoose.Types.ObjectId(cart._id),
                product: mongoose.Types.ObjectId(productId)
            });
            if (cartDetail) {
                throw "El producto ya ha sido agregado al carrito";
            }

            // Create and save cart detail
            cartDetail = new CartDetail({
                quantity: quantity,
                cart: mongoose.Types.ObjectId(cart._id),
                product: mongoose.Types.ObjectId(productId),
            });
            await cartDetail.save();
            
            const response = {
                'status': {
                    'code': 0,
                    'message': 'ok'
                }
            };
            res.status(200).json(response);

        } catch (e) {
            console.log(e);
            const response = {
                'status': {
                    'code': 1,
                    'message': `Error al guardar el carrito. ${e}`
                }
            };
            res.status(200).json(response);
        }
    }

    static async update(req, res, next) {
        try {
            // Process body data
            const { productId, quantity
            } = req.body;
            const user = req.user;

            // Validate user input
            if (!(productId && quantity)) {
                throw "Todos los campos son obligatorios";
            }

            // Get product and check stock 
            const product = await Product.findOne({_id: productId});
            if (product) {
                if (product.stock < quantity) {
                    throw "Stock no disponible";
                }
            } else {
                throw "Producto no encontrado";
            }

            // Get cart for user in our database
            let cart = await Cart.findOne({ user: mongoose.Types.ObjectId(user.user_id) });
            
            // Validate if product exist in the cart
            let cartDetail = await CartDetail.findOne({
                cart: mongoose.Types.ObjectId(cart._id),
                product: mongoose.Types.ObjectId(productId)
            });
            if (!cartDetail) {
                throw "El producto no existe en el carrito";
            }

            // Update cart detail
            cartDetail.quantity = quantity;
            await cartDetail.save();
            
            const response = {
                'status': {
                    'code': 0,
                    'message': 'ok'
                }
            };
            res.status(200).json(response);

        } catch (e) {
            console.log(e);
            const response = {
                'status': {
                    'code': 1,
                    'message': `Error al actualizar el carrito. ${e}`
                }
            };
            res.status(200).json(response);
        }
    }

    static async get(req, res, next) {
        try {
            const user = req.user;

            // Get cart 
            let cart = await Cart.findOne({ user: mongoose.Types.ObjectId(user.user_id) });
            
            if (!cart) {
                throw "El usuario aún no tiene un carrito con productos";
            }

            // Get cart detail
            let cartDetail = await CartDetail.find({
                cart: mongoose.Types.ObjectId(cart._id)
            }).select({ 'cart': 0, 'createdAt': 0, 'updatedAt': 0 })
                .populate('product', { 'name': 1, 'price': 1, 'stock': 1 });

            if (cartDetail) {
                const response = {
                    'status': {
                        'code': 0,
                        'message': 'ok'
                    },
                    'cartDetail': cartDetail
                };
                return res.status(200).send(response);
            } else {
                throw 'No se puede obtener detalle del carrito';
            }

        } catch (e) {
            console.log(e);
            const response = {
                'status': {
                    'code': 1,
                    'message': `Error al obtener el carrito. ${e}`
                },
                "cartDetail": []
            };
            res.status(200).json(response);
        }
    }
}