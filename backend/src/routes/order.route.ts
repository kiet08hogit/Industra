import { Router } from 'express';
import { createOrderController, getOrdersController, getOrderByIdController, reorderController } from '../controller/order.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Create Order (Checkout)
router.post('/', ...(requireAuth as any), createOrderController);

// Get Order History
router.get('/', ...(requireAuth as any), getOrdersController);

// Get Single Order     
router.get('/:id', ...(requireAuth as any), getOrderByIdController);

// Reorder 
router.post('/:id/reorder', ...(requireAuth as any), reorderController);

export default router;