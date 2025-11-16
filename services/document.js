import * as httpHelper from './http.js';

export async function PostDocument(data) {
	return await httpHelper.sendReq('/documents', httpHelper.httpMethod.Post, data);
}

export async function GetDocument() {
	return await httpHelper.sendReq('/documents', httpHelper.httpMethod.Get);
}

