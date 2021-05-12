import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
  deliverOrder,
  getOrderDetails,
  payOrder,
} from '../actions/orderActions'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from '../constants/orderConstants'

const OrderScreen = ({ history, match }) => {
  const orderID = match.params.id
  const dispatch = useDispatch()

  const [paypalSDKReady, setPaypalSDKReady] = useState(false)
  const [currrencyReady, setCurrrencyReady] = useState(false)
  const [convertedCurrency, setConvertedCurrency] = useState(0)

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  if (!loading) {
    //Calculate Item price
    order.itemsPrice = order.orderItems
      .reduce((acc, item) => acc + item.price * item.qty, Number(0))
      .toFixed(2)
  }

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    }

    if (!order || successPay || successDeliver || order._id !== orderID) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch(getOrderDetails(orderID))
    } else if (!order.isPaid) {
      if (userInfo && !userInfo.isAdmin) {
        convertCurrency(order.itemsPrice)
        if (!window.paypal) {
          addPayPalScript()
        } else {
          setPaypalSDKReady(true)
        }
      }
    }
  }, [order, orderID, dispatch, successPay, successDeliver, userInfo, history])

  const SuccessPaymentHandler = (paymentResult) => {
    console.log(paymentResult)
    dispatch(payOrder(orderID, paymentResult))
  }

  const deliverHandler = () => {
    dispatch(deliverOrder(order._id))
  }

  //Add the paypal script with fetching the paypal client id
  const addPayPalScript = async () => {
    const { data: clientId } = await axios.get('/api/config/paypal')
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
    script.async = true
    script.onload = () => {
      setPaypalSDKReady(true)
    }

    document.body.appendChild(script)
  }

  const convertCurrency = async (amount) => {
    const {
      data: { conversion_result },
    } = await axios.get(`/api/currency/${amount}`)
    if (conversion_result) {
      console.log(`Conversion result : ${conversion_result}`)
      setCurrrencyReady(true)
      setConvertedCurrency(Number(conversion_result).toFixed(2))
    }
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <h1>Order : {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item className='list-group'>
              <h2>Shipping</h2>
              <p>
                <strong>Name : </strong>{' '}
                {order.user ? order.user.name : 'Deleted profile'}
              </p>
              <p>
                <strong>Email : </strong>{' '}
                {order.user ? order.user.email : 'Deleted profile'}
              </p>
              <p>
                <strong>Address : </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivered on : {order.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item className='list-group'>
              <h2>Payment </h2>
              <p>
                <strong>Method : </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>Paid on : {order.paidAt}</Message>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              )}
            </ListGroup.Item>
          </ListGroup>

          <ListGroup.Item className='list-group'>
            <h2>Order Items</h2>
            {order.orderItems.length === 0 ? (
              <Message>No items in the order</Message>
            ) : (
              <ListGroup variant='flush'>
                {order.orderItems.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <Row>
                      <Col md={1}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col>
                        <Link to={`/product/${item.product}`}>
                          {' '}
                          {item.name}{' '}
                        </Link>
                      </Col>
                      <Col md={5}>
                        {item.qty} X LKR {item.price} = LKR{' '}
                        {item.qty * item.price}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </ListGroup.Item>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Order Price</Col>
                  <Col>LKR {Number(order.itemsPrice).toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>LKR {Number(order.shippingPrice).toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Taxes</Col>
                  <Col>LKR {Number(order.taxPrice).toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total Price</Col>
                  <Col>LKR {Number(order.totalPrice).toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>

              {loadingDeliver && <Loader />}

              {userInfo && !userInfo.isAdmin && !order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {currrencyReady &&
                    (!paypalSDKReady ? (
                      <Loader />
                    ) : (
                      <PayPalButton
                        amount={Number(convertedCurrency)}
                        currency='USD'
                        onSuccess={SuccessPaymentHandler}
                      />
                    ))}
                </ListGroup.Item>
              )}

              {userInfo && userInfo.isAdmin && (
                <ListGroup.Item>
                  <Button
                    disabled={!order.isDelivered && !order.isPaid}
                    type='button'
                    className='btn btn-block col-12'
                    onClick={deliverHandler}
                  >
                    Set as delivered
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen
