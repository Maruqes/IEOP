import * as httpHelper from './http.js';

export async function GetProducts() {
	return await httpHelper.sendReq('/products', httpHelper.httpMethod.Get);
}