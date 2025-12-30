
import express from 'express';
import * as clientService from '../services/clients.js';
import { filterData } from '../services/http.js';
import * as httpHelper from '../services/http.js';
import { OMelhorMiddleWareJaVisto } from '../services/clients.js';


const router = express.Router();

async function GetClient(req, res, next) {
	try {
		var data = await clientService.GetClient()
		res.send(filterData(data.data, []));
	} catch (err) {
		next(err);
	}
}

async function GetClientByID(req, res, next) {
	try {
		var id = req.params.id;
		var data = await clientService.GetClientByID(id)
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

		const result = await clientService.PostClient(clientData);
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

	const updated = await clientService.AddToCart(UserID, ProductID, qntInt);
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
		const updated = await clientService.RemoveFromCart(UserID, ProductID, qntInt);
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

	const cart = await clientService.GetCart(userId);
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
		const updated = await clientService.UpdateCart(UserID, ProductID, qntInt);
		return res.status(200).json(updated);
	} catch (err) {
		return res.status(400).json({ error: err.message });
	}
}


async function loginUserDuvidoso(req, res) {
	const { UserID } = req.body;
	if (!UserID) {
		return res.status(400).json({ error: "opa preciso de \"UserID\" digo eu" });
	}

	try {
		const token = clientService.LoginTrolado(UserID);
		return res.status(200).json(token);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
}

async function logoutUserDuvidoso(req, res) {
	const { UserID } = req.body;
	if (!UserID) {
		return res.status(400).json({ error: "opa preciso de \"UserID\" digo eu" });
	}

	try {
		const token = clientService.Logout(UserID);
		return res.status(200).json(token);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
}

router.post('/login', loginUserDuvidoso);


router.post('/', OMelhorMiddleWareJaVisto, PostClient);
router.get('/', OMelhorMiddleWareJaVisto, GetClient);

router.post('/cart/add', OMelhorMiddleWareJaVisto, AddToCart);
router.delete('/cart/remove', OMelhorMiddleWareJaVisto, RemoveFromCart);
router.get('/cart', OMelhorMiddleWareJaVisto, GetCart);
router.put('/cart/update', OMelhorMiddleWareJaVisto, UpdateCart);
router.post('/logout', OMelhorMiddleWareJaVisto, logoutUserDuvidoso);

router.get('/:id', OMelhorMiddleWareJaVisto, GetClientByID);


export default router;
