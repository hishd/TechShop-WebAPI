import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/database.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import axios from 'axios'
import path from 'path'

dotenv.config()
connectDB()

const app = express()

app.use(express.json())

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

app.get('/api/currency/:amount', async (req, res) => {
  const {
    data: { conversion_result },
  } = await axios.get(
    `https://v6.exchangerate-api.com/v6/${process.env.EXCHNAGE_API_KEY}/pair/LKR/USD/${req.params.amount}`
  )

  res.send({ conversion_result })
})

const __dirname = path.resolve()

app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

//Preparing for production & deployment
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend-tshop/build')))

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, 'frontend-tshop', 'build', 'index.html')
    )
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running')
  })
}

//Error middleware - 404
app.use(notFound)
//Error middleware - 500
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
