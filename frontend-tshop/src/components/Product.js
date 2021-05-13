import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Button } from 'react-bootstrap'
import Rating from './Rating'

const Product = ({ product }) => {
  return (
    <Card
      className='shadow-lg p-3 mb-5 bg-white rounded'
      style={{ height: '26rem', position: 'relative' }}
    >
      <Link to={`/product/${product._id}`}>
        <Card.Img
          src={product.image}
          varient='top'
          className='rounded'
          style={{ maxHeight: '200px' }}
        />
      </Link>

      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as='div'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>
        <Card.Text as='h4'>LKR {product.price}</Card.Text>
        <Link to={`/product/${product._id}`}>
          <Button
            className='btn btn-primary btn-sm rounded'
            style={{ position: 'absolute', right: 20, bottom: 20 }}
          >
            view product
          </Button>
        </Link>
      </Card.Body>
    </Card>
  )
}

export default Product
