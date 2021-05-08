import mongoose from 'mongoose'
import dotenv from 'dotenv'
import users from './data/users.js'
import product from './data/products.js'
import User from './models/userModel.js'
import Product from './models/productModel.js'
import Order from './models/productModel.js'
import connectDB from './config/database.js'

dotenv.config()

connectDB()

const importData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    const createdUsers = await User.insertMany(users)

    const adminUser = createdUsers[0]._id

    const sampleProducts = product.map((product) => {
      return {
        ...product,
        user: adminUser,
      }
    })

    await Product.insertMany(sampleProducts)

    console.log('Data Imported successfully!')
    process.exit()
  } catch (error) {
    console.log(`Error: ${error}`)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    console.log('Data Cleared successfully!')
    process.exit()
  } catch (error) {
    console.log(`Error: ${error}`)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}
