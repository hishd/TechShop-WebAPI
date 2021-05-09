import express from 'express'
import asyncHandler from 'express-async-handler'
import {
  getProductByID,
  getProducts,
  deleteProduct,
  updateProduct,
  createProduct,
  reviewProduct,
  getTopProducts,
} from '../controllers/productControllers.js'
import { isAdmin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(getProducts)
router.route('/top').get(getTopProducts)
router.route('/:id').get(getProductByID)
router.route('/:id').delete(protect, isAdmin, deleteProduct)
router.route('/:id').put(protect, isAdmin, updateProduct)
router.route('/').post(protect, isAdmin, createProduct)
router.route('/:id/reviews').post(protect, reviewProduct)

export default router