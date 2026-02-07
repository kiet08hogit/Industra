import pool from "./pool";
import { allowedTables } from "./allproducts";
import * as cartDb from "./cart";
import { Order, OrderItem } from "../type/type";

export const createOrder = async (userId: number): Promise<Order> => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const cart = await cartDb.getCart(userId);

        if (!cart || cart.items.length === 0) {
            throw new Error("Cart is empty");
        }

        const totalAmount = cart.items.reduce((sum, item) => {
            return sum + ((item.price || 0) * item.quantity);
        }, 0);
        const orderRes = await client.query(
            "INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, 'completed') RETURNING *",
            [userId, totalAmount]
        );
        const order = orderRes.rows[0];

        for (const item of cart.items) {
            await client.query(
                "INSERT INTO order_items (order_id, product_id, category, quantity, price_at_purchase) VALUES ($1, $2, $3, $4, $5)",
                [order.id, item.product_id, item.category, item.quantity, item.price || 0]
            );
        }

        await client.query("DELETE FROM cart_items WHERE cart_id = $1", [cart.id]);

        await client.query('COMMIT');
        return order;

    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
};

export const getOrders = async (userId: number): Promise<Order[]> => {
    const ordersRes = await pool.query(
        "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
        [userId]
    );
    const orders = ordersRes.rows;

    const enrichedOrders = await Promise.all(orders.map(async (order) => {
        const itemsRes = await pool.query("SELECT * FROM order_items WHERE order_id = $1", [order.id]);
        const items: OrderItem[] = itemsRes.rows;

        const enrichedItems = await Promise.all(items.map(async (item) => {
            const tableName = allowedTables[item.category];
            if (!tableName) return item;

            try {
                const productRes = await pool.query(
                    `SELECT name, image_url FROM ${tableName} WHERE id = $1`,
                    [item.product_id]
                );
                if (productRes.rows.length > 0) {
                    return {
                        ...item,
                        name: productRes.rows[0].name,
                        image_url: productRes.rows[0].image_url
                    };
                }
            } catch (e) {
            }
            return item;
        }));

        return { ...order, items: enrichedItems };
    }));

    return enrichedOrders;
};

export const getOrderById = async (userId: number, orderId: number): Promise<Order | null> => {
    const orders = await getOrders(userId);
    return orders.find(o => o.id == orderId) || null;
}

export const reorder = async (userId: number, orderId: number) => {
    const orderItemsRes = await pool.query(
        "SELECT * FROM order_items WHERE order_id = $1",
        [orderId]
    );
    const orderItems = orderItemsRes.rows;

    if (orderItems.length === 0) {
        throw new Error("Order not found or empty");
    }

    let cart = await cartDb.getCart(userId);
    if (!cart) {
        cart = await cartDb.createCart(userId);
    }

    for (const item of orderItems) {
        await cartDb.addToCart(userId, item.product_id, item.category, item.quantity);
    }

    return cartDb.getCart(userId);
};