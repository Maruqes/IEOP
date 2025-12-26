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

const isValidOBJECT = (input) => {
	if (input === null || input === undefined) return false;
	if (typeof input === 'object') return !Array.isArray(input);
	if (typeof input === 'string') {
		try {
			const parsed = JSON.parse(input);
			return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed);
		} catch {
			return false;
		}
	}
	return false;
};

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

	const res = await fetch('https://www.vendus.pt/ws/v1.2/' + url, options);

	const text = await res.text();

	let data = null;

	try {
		data = text ? JSON.parse(text) : null;
	} catch {
		data = text || null;
	}

	return {
		ok: res.ok,
		status: res.status,
		data
	};
}

//obrigado gpt
function setDeep(obj, path, value) {
	const keys = path.split('.');
	let current = obj;

	for (let i = 0; i < keys.length - 1; i++) {
		const k = keys[i]; /// algo.k.algo
		if (!(k in current)) {
			current[k] = {}; // criar caminho se nao existir
		}
		current = current[k];
	}
	current[keys[keys.length - 1]] = value;
}

function getDeepData(obj, path) {
	if (!path) return obj;

	const keys = Array.isArray(path) ? path : path.split('.');
	let current = obj;

	for (let i = 0; i < keys.length; i++) {
		const k = keys[i];

		if (!(k in current)) {
			console.log("caminho nao existe -> " + path)
			return undefined; //se caminho nao existir retorna undefined
		}

		current = current[k];
	}
	return current;
}

//filtra objetos ou array de objetos
//ex1: -> [{"obj1":123, "obj2":456}, {"obj1":789, "obj2":000}], com toSave = ["obj1"] -> [{"obj1":123}, {"obj1":789}]
//ex2: -> {"obj1":123, "obj2":456, "obj3":789, "obj4":000}, com toSave = ["obj1", "obj3"] -> {"obj1":123, "obj3":789}

//NAO FILTRA arrays dentro de objetos-> {"objetoPrincipal": [{"obj1":123}, {"obj2":456}]},
function filterData(data, toSave = []) {
	if (!Array.isArray(toSave) || toSave.length === 0)
		return data

	//check if data is an array
	if (Array.isArray(data)) {
		var res = []
		for (let i = 0; i < data.length; i++) {
			var filteredArrI = filterData(data[i], toSave)
			res.push(filteredArrI)
		}
		return res
	}

	if (!isValidOBJECT(data)) {
		throw new Error(`object is not valid`);
	}
	var res = {}
	for (let i = 0; i < toSave.length; i++) {
		const path = toSave[i];
		const value = getDeepData(data, path);

		if (value !== undefined) {
			setDeep(res, path, value);
		}
	}
	return res
}

function GetDataFromRequest(req, requiredFields, optionalFields) {
	const allFields = [...requiredFields, ...optionalFields]

	const missingFields = requiredFields.filter(field => !req.body[field]);
	if (missingFields.length > 0) {
		throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
	}

	const clientData = {};
	for (let i = 0; i < allFields.length; i++) {
		if (req.body[allFields[i]] !== undefined) {
			clientData[allFields[i]] = req.body[allFields[i]];
		}
	}
	return clientData
}

export { sendReq, httpMethod, filterData, GetDataFromRequest, getToken };
