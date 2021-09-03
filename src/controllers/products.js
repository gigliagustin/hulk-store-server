import mongoose from 'mongoose';
import Product from '../models/product';
import { Roles } from '../res/globals';

export default class ProductController {

    static async add(req, res, next) {
        try {
            // Process body data
            const { name, description, price, stock, status, productType
            } = req.body;
            
            // Validate user input
            if (!(name && description && price && stock && status && productType)) {
                throw "Todos los campos son obligatorios";
            }

            const product = new Product({
                name: name,
                description: description,
                price: price,
                stock: stock,
                status: status,
                productType: mongoose.Types.ObjectId(productType),
            })
            await product.save();
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
                    'message': `Error al guardar el producto. ${e}`
                }
            };
            res.status(200).json(response);
        }
    }

    static async update(req, res, next) {
        try {
            // Process body data
            const { id, name, description, price, stock, status, productType
            } = req.body;
            
            // Validate user input
            if (!(id && name && description && price && stock && status && productType)) {
                throw "Todos los campos son obligatorios";
            }

            // Get product and update 
            const product = await Product.findById(id).exec();
            if (product) {
                product.name = name;
                product.description = description;
                product.price = price;
                product.stock = stock;
                product.status = status;
                product.productType = mongoose.Types.ObjectId(productType);
                await product.save();
                const response = {
                    'status': {
                        'code': 0,
                        'message': 'ok'
                    }
                };
                res.status(200).json(response);
            } else {
                throw "Producto no encontrado";
            }
            
        } catch (e) {
            console.log(e);
            const response = {
                'status': {
                    'code': 1,
                    'message': `Error al guardar el producto. ${e}`
                }
            };
            res.status(200).json(response);
        }
    }    

    static async getById(req, res, next) {
        const product = await Product.findById(req.params.id)
            .populate('productType', { 'name': 1 } );
        if (product) {
            const response = {
                'status': {
                    'code': 0,
                    'message': 'ok'
                },
                'product': product
            };
            res.status(200).json(response);
        } else {
            const response = {
                'status': {
                    'code': 1,
                    'message': 'Product not found'
                }
            };
            res.status(200).json(response);
        }
    }

    static async getAll(req, res, next) {
        const products = await Product.find().populate('productType');
        const response = {
            'status': {
                'code': 0,
                'message': 'ok'
            },
            'products': products
        };
        
        res.status(200).json(response);
    }

    static async updateStock(req, res, next) {
        try {
            // Process body data
            const { id, stock } = req.body;
            
            // Validate user input
            if (!(id && stock)) {
                throw "Todos los campos son obligatorios";
            }

            // Get product and update stock
            const product = await Product.findById(id).exec();
            if (product) {
                product.stock = stock;
                await product.save();
                const response = {
                    'status': {
                        'code': 0,
                        'message': 'ok'
                    }
                };
                res.status(200).json(response);
            } else {
                throw "Producto no encontrado";
            }
            
        } catch (e) {
            console.log(e);
            const response = {
                'status': {
                    'code': 1,
                    'message': `Error al actualizar stock. ${e}`
                }
            };
            res.status(200).json(response);
        }
    } 
}