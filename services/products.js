import * as httpHelper from './http.js';

export async function GetProducts() {
	return await httpHelper.sendReq('/products', httpHelper.httpMethod.Get);
}

export async function GetProductById(id) {
	return await httpHelper.sendReq(`/products/${id}`, httpHelper.httpMethod.Get);
}