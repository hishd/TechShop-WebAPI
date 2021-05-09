import express from 'express'
import asyncHandler from 'express-async-handler'
import {
  authUser,
  deleteUser,
  getUserProfile,
  getUsers,
  registerUser,
  updateUserProfile,
} from '../controllers/userControllers.js'
import { isAdmin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/login', authUser)
router.route('/profile').get(protect, getUserProfile)
router.route('/profile').put(protect, updateUserProfile)
router.route('/').post(registerUser)
router.route('/').get(protect, isAdmin, getUsers)
router.route('/:id').delete(protect, isAdmin, deleteUser)

export default router