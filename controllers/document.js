import express from 'express';
import * as documentService from '../services/document.js';
import { filterData } from '../services/http.js';
import * as httpHelper from '../services/http.js';


const router = express.Router();

async function GetDocuments(req, res, next) {
	try {
		var data = await documentService.GetDocument()
		res.send(filterData(data.data, []));
	} catch (err) {
		next(err);
	}
}


async function PostDocuments(req, res) {
	try {
		const docData = httpHelper.GetDataFromRequest(
			req,
			['items', 'userId'],
			[

			]
		);

		docData["mode"] = "normal"
		docData["type"] = "FT"
		docData["payments"] = [{
			"id": 295704645
		}]

		console.log(docData)
		const result = await documentService.PostDocument(docData, docData["userId"]);
		return res.status(result.status).json(result.data);

	} catch (err) {
		console.error('err no PostClient', err);
		return res.status(500).json({ error: err.message });
	}
}



router.post('/', PostDocuments);
router.get('/', GetDocuments);

export default router;
