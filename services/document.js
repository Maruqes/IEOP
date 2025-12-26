import * as httpHelper from './http.js';
import * as productService from '../services/clients.js';


const userDocumentsMap = new Map();

function cleanEnv(v) {
	return String(v ?? "")
		.replace(/\r/g, "")
		.trim()
		.replace(/^"(.*)"$/, "$1")
		.replace(/^'(.*)'$/, "$1");
}

async function sendPdfToEmailWebhook(pdfBuffer, email, filename = "teste.pdf") {
	const webhookUrl = cleanEnv(process.env.EMAIL_WEBHOOK_URL);
	const headerName = cleanEnv(process.env.EMAIL_WEBHOOK_HEADER_NAME);
	const headerValue = cleanEnv(process.env.EMAIL_WEBHOOK_HEADER_VALUE);

	if (!webhookUrl || !headerName || !headerValue) {
		throw new Error("Missing EMAIL_WEBHOOK_URL / EMAIL_WEBHOOK_HEADER_NAME / EMAIL_WEBHOOK_HEADER_VALUE");
	}
	if (!email) throw new Error("Missing email param for webhook");

	const url = new URL(webhookUrl);
	url.searchParams.set("email", email);

	const form = new FormData();
	form.append("file", new Blob([pdfBuffer], { type: "application/pdf" }), filename);

	const headers = { [headerName]: headerValue };

	const resp = await fetch(url.toString(), {
		method: "POST",
		headers,
		body: form,
	});

	const bodyText = await resp.text().catch(() => "");
	if (!resp.ok) {
		throw new Error(`Email webhook failed: ${resp.status} ${resp.statusText} - ${bodyText}`);
	}

	return { ok: true, status: resp.status, data: bodyText };
}


export async function PostDocument(data, userId, email) {
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
		delete data.email;
		let res = await httpHelper.sendReq('/documents', httpHelper.httpMethod.Post, data);

		// Guarda o res no array relacionado ao user
		if (!userDocumentsMap.has(userId)) {
			userDocumentsMap.set(userId, []);
		}
		userDocumentsMap.get(userId).push(res);

		const downloadpdf = await DownloadPdf(res.data.id);

		await sendPdfToEmailWebhook(
			downloadpdf.data,
			email,
			`document-${res.data.id}.pdf`
		);

		return res;


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
