import * as httpHelper from './http.js';
import * as productService from '../services/clients.js';

const userDocumentsMap = new Map();

export async function PostDocument(data, userId) {
	try {
		if (data.items.length <= 0) {
			throw new Error('No items provided');
		}
		for (let i = 0; i < data.items.length; i++) {
			const element = data.items[i];
			try {
				await productService.RemoveFromCart(userId, element.id, element.qty);
			} catch (error) {
				if (!error || error.message !== 'Product not in cart') {
					throw error;
				}
			}
		}
		delete data.userId;
		let res = await httpHelper.sendReq('/documents', httpHelper.httpMethod.Post, data);

		// Guarda o res no array relacionado ao user
		if (!userDocumentsMap.has(userId)) {
			userDocumentsMap.set(userId, []);
		}
		userDocumentsMap.get(userId).push(res);

		return res;
	} catch (error) {
		throw error;
	}
}

export async function GetDocument() {
	return await httpHelper.sendReq('/documents', httpHelper.httpMethod.Get);
}

export function GetDocumentHistory(userId) {
	if (!userDocumentsMap.has(userId)) {
		return [];
	}
	return userDocumentsMap.get(userId);
}




export async function DownloadPdf(id) {
	const tokenzita = httpHelper.getToken();

	const res = await fetch(`https://www.vendus.pt/ws/v1.1//documents/${id}.pdf`, {
		headers: {
			Authorization: 'Bearer ' + tokenzita
		}
	});

	const buffer = Buffer.from(await res.arrayBuffer());

	return {
		ok: res.ok,
		status: res.status,
		contentType: res.headers.get('content-type'),
		data: buffer
	};
}
