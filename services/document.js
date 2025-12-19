import * as httpHelper from './http.js';
import * as productService from '../services/clients.js';

export async function PostDocument(data, userId) {
	try {
		if (data.items.length <= 0) {
			throw new Error('No items provided');
		}
		for (let i = 0; i < data.items.length; i++) {
			const element = data.items[i];
			productService.RemoveFromCart(userId, element.id, element.qty)
		}
		delete data.userId;
		return await httpHelper.sendReq('/documents', httpHelper.httpMethod.Post, data);
	} catch (error) {
		throw error;
	}
}

export async function GetDocument() {
	return await httpHelper.sendReq('/documents', httpHelper.httpMethod.Get);
}

