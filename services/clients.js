import * as httpHelper from './http.js';

// Simple in-memory cart storage keyed by user ID
const carts = new Map();

function getOrCreateCart(userId) {
	if (!carts.has(userId)) {
		carts.set(userId, new Map());
	}
	return carts.get(userId);
}

function normalizeCartResponse(cartMap) {
	const items = [];
	for (const [productId, quantity] of cartMap.entries()) {
		items.push({ productId, quantity });
	}
	return { items };
}

export async function PostClient(data) {
	return await httpHelper.sendReq('/clients', httpHelper.httpMethod.Post, data);
}

export async function GetClient() {
	return await httpHelper.sendReq('/clients', httpHelper.httpMethod.Get);
}

export async function GetClientByID(id) {
	return await httpHelper.sendReq(`/clients/${id}`, httpHelper.httpMethod.Get);
}

export function AddToCart(userId, productId, quantity) {
	const cart = getOrCreateCart(userId);
	const existing = cart.get(productId) || 0;
	cart.set(productId, existing + quantity);
	return normalizeCartResponse(cart);
}

export function RemoveFromCart(userId, productId, quantity) {
	const cart = getOrCreateCart(userId);
	if (!cart.has(productId)) {
		throw new Error('Product not in cart');
	}

	if (quantity === undefined) {
		cart.delete(productId);
		return normalizeCartResponse(cart);
	}

	const newQty = cart.get(productId) - quantity;
	if (newQty > 0) {
		cart.set(productId, newQty);
	} else {
		cart.delete(productId);
	}
	return normalizeCartResponse(cart);
}

export function GetCart(userId) {
	const cart = getOrCreateCart(userId);
	return normalizeCartResponse(cart);
}