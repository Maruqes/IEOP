import express from 'express';
import * as productService from '../services/products.js';
import { filterData } from '../services/http.js';
import * as mongoService from '../services/mongo.js';
import { OMelhorMiddleWareJaVisto } from '../services/clients.js';


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
		res.send(filterData(data.data, ["id", "prices", "reference", "stock_store", "description", "images.m"]));
	} catch (err) {
		next(err);
	}
}

async function GetSpecs(req, res, next) {
	try {
		const id = req.params.id;
		const doc = await mongoService.GetSpec(id);
		if (!doc) return res.status(404).json({ error: 'Not found' });
		res.json(doc);
	} catch (err) {
		next(err);
	}
}

async function PostSpecs(req, res, next) {
	try {
		const id = req.params.id;
		const specs = req.body; // expects raw JSON
		const doc = await mongoService.AddSpec(id, specs);
		res.json(doc);
	} catch (err) {
		next(err);
	}
}


router.get('/', GetProducts);
router.get('/specs/:id', GetSpecs)
router.post('/specs/:id', OMelhorMiddleWareJaVisto, PostSpecs)

router.get('/:id', GetProductById);
export default router;
