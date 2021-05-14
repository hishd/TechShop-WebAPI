import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listProducts } from '../actions/productActions'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'

const HomeScreen = ({ match }) => {
  const keyWord = match.params.keyword
  const pageNumber = match.params.pageNumber || 1
  const dispatch = useDispatch()
  //Fetching the productList state which is handled via react
  const productList = useSelector((state) => state.productList)

  const { loading, error, products, page, pages } = productList

  useEffect(() => {
    //Firing reducer actions
    dispatch(listProducts(keyWord, pageNumber))
  }, [dispatch, keyWord, pageNumber])

  return (
    <>
      {!keyWord ? <ProductCarousel /> : console.log('keyword')}
      <h1> Latest Products </h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyWord ? keyWord : ''}
          />
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  )
}

export default HomeScreen
