import express from 'express'
import asyncHandler from 'express-async-handler'
import {
  addOrderItems,
  getOrderByID,
  getOrders,
  getPlacedOrders,
  updateOrderToDelivered,
  updateOrderToPaid,
} from '../controllers/orderController.js'
import { protect, isAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').post(protect, addOrderItems)
router.route('/myorders').get(protect, getPlacedOrders)
router.route('/:id').get(protect, getOrderByID)
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/').get(protect, isAdmin, getOrders)
router.route('/:id/deliver').put(protect, isAdmin, updateOrderToDelivered)

export default router
