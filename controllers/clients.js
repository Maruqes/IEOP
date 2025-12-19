import express from 'express';
import * as productService from '../services/clients.js';
import { filterData } from '../services/http.js';
import * as httpHelper from '../services/http.js';


const router = express.Router();

async function GetClient(req, res, next) {
	try {
		var data = await productService.GetClient()
		res.send(filterData(data.data, []));
	} catch (err) {
		next(err);
	}
}

async function GetClientByID(req, res, next) {
	try {
		var id = req.params.id;
		var data = await productService.GetClientByID(id)
		res.send(filterData(data, []));
	} catch (err) {
		next(err);
	}
}
async function PostClient(req, res) {
	try {
		const clientData = httpHelper.GetDataFromRequest(
			req,
			['name', 'email'],
			[
				'phone', 'mobile', 'external_reference', 'notes', 'website', 'country',
				'send_email', 'default_pay_due', 'irs_retention', 'postalcode',
				'city', 'address', 'price_group_id', 'manager_id'
			]
		);

		const result = await productService.PostClient(clientData);
		return res.status(result.status).json(result.data);

	} catch (err) {
		console.error('err no PostClient', err);
		return res.status(500).json({ error: err.message });
	}
}


async function AddToCart(req, res) {
	const { UserID, ProductID, Qnt } = req.body;

	if (!UserID || !ProductID || Qnt === undefined || Qnt === null) {
		return res.status(400).json({ error: "Missing fields" });
	}

	const qntInt = Number.parseInt(Qnt, 10);

	if (!Number.isInteger(qntInt) || qntInt <= 0) {
		return res.status(400).json({ error: "Qnt must be a positive integer" });
	}

	const updated = await productService.AddToCart(UserID, ProductID, qntInt);
	return res.status(200).json(updated);
}

async function RemoveFromCart(req, res) {
	const { UserID, ProductID, Qnt } = req.body;

	if (!UserID || !ProductID) {
		return res.status(400).json({ error: "Missing fields" });
	}

	let qntInt = undefined;
	if (Qnt !== undefined && Qnt !== null) {
		qntInt = Number.parseInt(Qnt, 10);
		if (!Number.isInteger(qntInt) || qntInt <= 0) {
			return res.status(400).json({ error: "Qnt must be a positive integer when provided" });
		}
	}

	try {
		const updated = await productService.RemoveFromCart(UserID, ProductID, qntInt);
		return res.status(200).json(updated);
	} catch (err) {
		return res.status(400).json({ error: err.message });
	}
}

async function GetCart(req, res) {
	const { userId } = req.query;

	if (!userId) {
		return res.status(400).json({ error: "Missing userId" });
	}

	const cart = await productService.GetCart(userId);
	return res.status(200).json(cart);
}


async function UpdateCart(req, res) {
	const { UserID, ProductID, Qnt } = req.body;

	if (!UserID || !ProductID || Qnt === undefined || Qnt === null) {
		return res.status(400).json({ error: "Missing fields" });
	}

	const qntInt = Number.parseInt(Qnt, 10);

	if (!Number.isInteger(qntInt) || qntInt < 0) {
		return res.status(400).json({ error: "Qnt must be a non-negative integer" });
	}

	try {
		const updated = await productService.UpdateCart(UserID, ProductID, qntInt);
		return res.status(200).json(updated);
	} catch (err) {
		return res.status(400).json({ error: err.message });
	}
}


router.post('/', PostClient);
router.get('/', GetClient);

router.post('/cart/add', AddToCart)
router.delete('/cart/remove', RemoveFromCart)
router.get('/cart', GetCart)
router.put('/cart/update', UpdateCart);

router.get('/:id', GetClientByID);

export default router;
