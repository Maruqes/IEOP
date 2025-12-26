import * as httpHelper from './http.js';
import * as mongoDb from '../services/mongo.js';

export async function GetProducts() {
	return await httpHelper.sendReq('/products', httpHelper.httpMethod.Get);
}

export async function GetProductById(id) {
	return await httpHelper.sendReq(`/products/${id}`, httpHelper.httpMethod.Get);
}