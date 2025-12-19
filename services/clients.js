import * as httpHelper from './http.js';
import * as productService from '../services/products.js';

// Simple in-memory cart storage keyed by user ID
const carts = new Map();

function getOrCreateCart(userId) {
	if (!carts.has(userId)) {
		carts.set(userId, new Map());
	}
	return carts.get(userId);
}

async function normalizeCartResponse(cartMap) {
	const items = [];
	for (const [productId, quantity] of cartMap.entries()) {
		var product = await productService.GetProductById(productId)
		items.push({ productId, product, quantity });
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

export async function AddToCart(userId, productId, quantity) {
	const cart = getOrCreateCart(userId);
	const existing = cart.get(productId) || 0;
	cart.set(productId, existing + quantity);
	return await normalizeCartResponse(cart);
}

export async function RemoveFromCart(userId, productId, quantity) {
	const cart = getOrCreateCart(userId);
	if (!cart.has(productId)) {
		throw new Error('Product not in cart');
	}

	if (quantity === undefined) {
		cart.delete(productId);
		return await normalizeCartResponse(cart);
	}

	const newQty = cart.get(productId) - quantity;
	if (newQty > 0) {
		cart.set(productId, newQty);
	} else {
		cart.delete(productId);
	}
	return await normalizeCartResponse(cart);
}

export async function GetCart(userId) {
	const cart = getOrCreateCart(userId);
	const response = await normalizeCartResponse(cart);
	const totalItems = Array.from(cart.values()).reduce((sum, qty) => sum + qty, 0);
	const totalPrice = response.items.reduce((sum, item) => {
		const productData = item.product && item.product.data ? item.product.data : null;
		const price = productData && productData.gross_price ? Number(productData.gross_price) : 0;
		return sum + price * item.quantity;
	}, 0);
	return { ...response, totalItems, totalPrice };
}

// Atualiza a quantidade de um produto no carrinho
export async function UpdateCart(userId, productId, quantity) {
	const cart = getOrCreateCart(userId);
	if (quantity === 0) {
		// Se quantidade for zero, remove o produto do carrinho
		cart.delete(productId);
	} else {
		cart.set(productId, quantity);
	}
	return await normalizeCartResponse(cart);
}