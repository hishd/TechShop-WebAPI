import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'
import emailValidator from 'email-validator'

const validateName = (name) => {
  var re = /^[a-zA-Z ]+$/
  return re.test(name)
}

const validatePassword = (password) => {
  var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
  return re.test(password)
}

// @desc Auth user and get a token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!emailValidator.validate(email)) {
    throw new Error('Invalid email address')
  }

  const user = await User.findOne({ email: email })

  //Added google sign in
  if (user) {
    if (req.body.authType && req.body.authType === 'google') {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      })
    } else {
      if (!validatePassword(password)) {
        throw new Error('Invalid password')
      }

      console.log(password)

      if (await user.matchPassword(password)) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id),
        })
      } else {
        res.status(401)
        throw new Error('Invalid email or password')
      }
    }
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }

  //Prev implementation : Nimesh
  // if (user && (await user.matchPassword(password))) {
  //   res.json({
  //     _id: user._id,
  //     name: user.name,
  //     email: user.email,
  //     isAdmin: user.isAdmin,
  //     token: generateToken(user._id),
  //   })
  // } else {
  //   res.status(401)
  //   throw new Error('Invalid email or password')
  // }
})

// @desc Regisgter a new user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  var { name, email, password } = req.body

  if (!validateName(name)) {
    throw new Error('Invalid name')
  }

  if (!emailValidator.validate(email)) {
    throw new Error('Invalid email address')
  }

  if (!req.body.authType) {
    throw new Error('No authentication type!')
  }

  if (req.body.authType === 'google') {
    password = 'google@123'
  } else {
    if (!validatePassword(password)) {
      throw new Error(
        'Password should between 6-20 chars, with at least one numeric, uppercase & lowercase digit.'
      )
    }
  }

  const userExists = await User.findOne({ email: email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create({
    name,
    email,
    password,
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc uadpte user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  if (!validateName(req.body.name)) {
    throw new Error('Invalid name')
  }

  if (!emailValidator.validate(req.body.email)) {
    throw new Error('Invalid email address')
  }

  const user = await User.findById(req.user._id)
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email

    if (req.body.password) {
      if (!validatePassword(req.body.password)) {
        throw new Error(
          'Password should between 6-20 chars, with at least one numeric, uppercase & lowercase digit. ' +
            req.body.password
        )
      }

      user.password = req.body.password
    }

    const updatedUser = await user.save()
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc get all users
// @route GET /api/users/
// @access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

// @desc delete a user
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (user) {
    await user.remove()
    res.json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
}
