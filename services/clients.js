import * as httpHelper from './http.js';

export async function PostClient(data) {
	return await httpHelper.sendReq('/clients', httpHelper.httpMethod.Post, data);
}

export async function GetClient() {
	return await httpHelper.sendReq('/clients', httpHelper.httpMethod.Get);
}

export async function GetClientByID(id) {
	return await httpHelper.sendReq(`/clients/${id}`, httpHelper.httpMethod.Get);
}