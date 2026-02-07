import { Request, Response } from 'express';
import * as cartDb from '../db/cart';

const getUserId = (req: Request): number => {
    // @ts-ignore
    if (!req.user || !req.user.id) {
        throw new Error("User not authenticated");
    }
    // @ts-ignore
    return req.user.id;
};

export const getCart = async (req: Request, res: Response) => {
    try {
        console.log('🛒 getCart called');
        console.log('Auth object:', req.auth);
        console.log('User object:', req.user);

        const userId = getUserId(req);
        console.log('User ID:', userId);

        let cart = await cartDb.getCart(userId);
        if (!cart) {
            cart = await cartDb.createCart(userId);
        }
        res.json(cart);
    } catch (error: any) {
        console.error('❌ Cart error:', error.message);
        console.error('Full error:', error);
        res.status(500).json({ message: error.message || "Error fetching cart" });
    }
};

export const addToCart = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        const { productId, category, quantity } = req.body;

        if (!productId || !category) {
            res.status(400).json({ message: "Product ID and Category are required" });
            return;
        }

        await cartDb.addToCart(userId, productId, category, quantity || 1);
        const cart = await cartDb.getCart(userId);
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding to cart" });
    }
};

export const updateCartItem = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;
        const { quantity } = req.body;

        await cartDb.updateCartItem(userId, parseInt(id as string), quantity);
        const cart = await cartDb.getCart(userId);
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating cart item" });
    }
};

export const removeFromCart = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        const { id } = req.params;

        await cartDb.removeFromCart(userId, parseInt(id as string));
        const cart = await cartDb.getCart(userId);
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error removing from cart" });
    }
};

import { getRelatedProducts, searchWithRelevance } from '../utils/recommender';

export const getCartRecommendationsController = async (req: Request, res: Response) => {
    try {
        const userId = getUserId(req);
        const cart = await cartDb.getCart(userId);

        let recommendations = [];

        if (!cart || cart.items.length === 0) {
            // Default recommendations if cart is empty
            recommendations = await searchWithRelevance("safety tools");
        } else {
            // Get recommendations based on the last item added
            const lastItem = cart.items[cart.items.length - 1];
            recommendations = await getRelatedProducts(lastItem.product_id);

            // If few recommendations, mix with generic ones
            if (recommendations.length < 3) {
                const generic = await searchWithRelevance("safety");
                recommendations = [...recommendations, ...generic];
            }
        }

        // Return top 5 unique recommendations
        const unique = recommendations.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i).slice(0, 5);
        res.json(unique);
    } catch (error) {
        console.error("Error fetching cart recommendations:", error);
        res.status(500).json({ message: "Error fetching recommendations" });
    }
};
