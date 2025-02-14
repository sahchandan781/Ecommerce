import express from 'express'
import { addProduct, removeProduct, listProduct, singleProduct } from '../controllers/productController.js'

const productRouter = express.Router();

productRouter.post('/add', addProduct);
productRouter.post('/remove', removeProduct);
productRouter.post('/singleproduct', singleProduct);
productRouter.get('list', listProduct);

export default productRouter;