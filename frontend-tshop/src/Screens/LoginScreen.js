import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { login } from '../actions/userActions'
import GoogleLogin from 'react-google-login'
import dotenv from 'dotenv'
import { ToastContainer, toast } from 'material-react-toastify'
import 'material-react-toastify/dist/ReactToastify.css'

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  dotenv.config()

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    //Redirect user to Home if logged in
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password))
  }

  const handleGoogleSignIn = async (googleData) => {
    if (!googleData.profileObj.email) {
      console.log('Email not found')
      notifyAlert('Google sign up failed !', 'ERROR')
      return
    }

    dispatch(login(googleData.profileObj.email, password, 'google'))
  }

  const notifyAlert = (message, type) => {
    switch (type) {
      case 'SUCCESS':
        toast.success(`${message}`)
        break
      case 'ERROR':
        toast.error(`${message}`)
        break
      case 'WARN':
        toast.warning(`${message}`)
        break
      case 'INFO':
        toast.info(`${message}`)
        break
      default:
        toast(`${message}`)
        break
    }
  }

  return (
    <FormContainer>
      <h1>Sign In</h1>
      <ToastContainer />
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email' className='form-group'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            required
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='password' className='form-group'>
          <Form.Label>Enter Password</Form.Label>
          <Form.Control
            required
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className='form-group' style={{ textAlign: 'center' }}>
          <Button type='submit' variant='primary' className='btn-signin col-4'>
            Sign In
          </Button>
        </Form.Group>
        <Form.Group className='form-group' style={{ textAlign: 'center' }}>
          <GoogleLogin
            clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
            buttonText='Sign in with Google'
            onSuccess={handleGoogleSignIn}
            onFailure={handleGoogleSignIn}
            cookiePolicy={'single_host_origin'}
          />
        </Form.Group>
      </Form>

      <Row className='py-3'>
        <Col style={{ textAlign: 'center' }}>
          New to TechShop?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
            Register here
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen
