import express from 'express';
import * as productService from '../services/products.js';
import { filterData } from '../services/http.js';

const router = express.Router();

async function GetProducts(req, res, next) {
	try {
		var data = await productService.GetProducts()
		res.send(filterData(data.data, ["id", "prices", "reference", "compound.stock.stock", "description", "images.m"]));
	} catch (err) {
		next(err);
	}
}

async function GetProductById(req, res, next) {
	try {
		var id = req.params.id;
		var data = await productService.GetProductById(id)
		res.send(filterData(data, ["id", "prices", "reference", "stock_store", "description", "images.m"]));
	} catch (err) {
		next(err);
	}
}
router.get('/', GetProducts);
router.get('/:id', GetProductById);

export default router;
