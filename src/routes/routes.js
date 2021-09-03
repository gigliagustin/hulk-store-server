import express from 'express';
import auth from '../middlewares/auth';
import checkIfAuthorized from '../middlewares/authorization';

import ProductController from '../controllers/products';
import UserController from '../controllers/users';
import CartController from '../controllers/cart';
import SalesController from '../controllers/sales';

const router = express.Router()

/* routes for products */
router.get("/products", async (req, res, next) => {
    ProductController.getAll(req, res, next);
});
router.get("/product/:id", async (req, res, next) => {
    ProductController.getById(req, res, next);
});
router.post("/product", auth, checkIfAuthorized({hasRole: ['admin']}), async (req, res, next) => {
    ProductController.add(req, res, next);
});
router.put("/product", auth, checkIfAuthorized({hasRole: ['admin']}), async (req, res, next) => {
    ProductController.update(req, res, next);
});
router.post("/productUpdateStock", auth, checkIfAuthorized({hasRole: ['admin']}), async (req, res, next) => {
    ProductController.updateStock(req, res, next);
});

/* routes for users */
router.post("/user/register", async (req, res, next) => {
    UserController.register(req, res, next);
});
router.post("/user/login", async (req, res, next) => {
    UserController.login(req, res, next);
});

/* routes for cart */
router.post("/cart", auth, async (req, res, next) => {
    CartController.add(req, res, next);
});
router.put("/cart", auth, async (req, res, next) => {
    CartController.update(req, res, next);
});
router.get("/cart", auth, async (req, res, next) => {
    CartController.get(req, res, next);
});

/* routes for sales */
router.post("/sale", auth, async (req, res, next) => {
    SalesController.add(req, res, next);
});
router.get("/sales", auth, async (req, res, next) => {
    SalesController.getAll(req, res, next);
});

export default router;