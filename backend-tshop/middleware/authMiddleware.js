import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

const protect = asyncHandler(async (req, res, next) => {
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    console.log('Token found')
  }

  try {
    token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')

    if (user) {
      req.user = user
      next()
    } else {
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  } catch (error) {
    console.error(error)
    res.status(401)
    throw new Error('Not authorized, no token failed')
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token found')
  }
})

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized, admin only')
  }
}

export { protect, isAdmin }
