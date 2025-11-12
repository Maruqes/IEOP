import express from 'express';
import * as productService from '../services/products.js';
import { filterData } from '../services/http.js';

const router = express.Router();

async function GetProducts(req, res) {
	var data = await productService.GetProducts()
	res.send(filterData(data.data, ["id", "prices", "compound.stock.stock", "stores.store_id"]));
}

router.get('/', GetProducts);

export default router;
