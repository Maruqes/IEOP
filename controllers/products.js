import express from 'express';
import * as productService from '../services/products.js';

const router = express.Router();

async function GetProducts(req, res) {
	res.send(await productService.GetProducts());
}

router.get('/', GetProducts);

export default router;
