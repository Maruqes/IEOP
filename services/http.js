import { ENV } from '../config/env.js';

const httpMethod = Object.freeze({
	Get: 'GET',
	Post: 'POST',
	Put: 'PUT',
	Patch: 'PATCH',
	Delete: 'DELETE',
	Head: 'HEAD',
	Options: 'OPTIONS'
});

let token = '';

function getToken() {
	if (token !== '') return token;

	const envToken = (ENV && ENV.API_TOKEN) || process.env.API_TOKEN;
	if (!envToken) {
		throw new Error(
			'No API token found (set environment variable API_TOKEN or configure .env)'
		);
	}

	token = envToken;
	return token;
}

/*
start url with /products
*/
async function sendReq(url, method = httpMethod.Get, payload = undefined) {
	const tokenzita = getToken();

	const headers = {
		'Content-Type': 'application/json',
		Authorization: 'Bearer ' + tokenzita
	};

	const options = { method, headers };
	if (payload !== undefined) options.body = JSON.stringify(payload);

	const res = await fetch('https://www.vendus.pt/ws/v1.1/' + url, options);

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`HTTP ${res.status}: ${text}`);
	}

	const data = await res.json();
	console.log("called " + url + " with success")
	return data;
}

export { sendReq, httpMethod };