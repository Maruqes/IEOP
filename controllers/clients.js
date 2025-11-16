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



router.post('/', PostClient);
router.get('/', GetClient);
router.get('/:id', GetClientByID);

export default router;
