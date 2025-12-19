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

async function GetHistory(req, res) {
	const userId = req.query.userId;
	if (!userId) {
		return res.status(400).json({ error: 'userId is required' });
	}
	const history = documentService.GetDocumentHistory(userId);
	return res.json(history);
}

async function GetDocumentById(req, res, next) {
	try {
		const id = req.params.id;
		if (!id) {
			return res.status(400).json({ error: 'id is required' });
		}
		const data = await documentService.GetDocument();

		const found = (data.data || []).find(doc => String(doc.id) === String(id));
		if (!found) {
			return res.status(404).json({ error: 'Document not found' });
		}
		return res.json(found);
	} catch (err) {
		next(err);
	}
}

router.post('/', PostDocuments);
router.get('/', GetDocuments);
router.get('/history', GetHistory);
router.get('/:id', GetDocumentById);

export default router;
