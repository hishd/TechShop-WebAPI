import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { register } from '../actions/userActions'
import GoogleLogin from 'react-google-login'
import dotenv from 'dotenv'
import { ToastContainer, toast } from 'material-react-toastify'
import 'material-react-toastify/dist/ReactToastify.css'

const RegisterScreen = ({ location, history }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()
  dotenv.config()

  const userRegister = useSelector((state) => state.userRegister)
  const { loading, error, userInfo } = userRegister

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    //Redirect user to Home if logged in
    if (userInfo) {
      history.push(redirect)
    }
  }, [history, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords does not match')
    } else {
      //Dispatching register action
      dispatch(register(name, email, password))
    }
  }

  const handleGoogleSignUp = async (googleData) => {
    if (!googleData.profileObj.email) {
      console.log('Email not found')
      notifyAlert('Google sign up failed !', 'ERROR')
      return
    }

    if (!googleData.profileObj.givenName) {
      console.log('User name not found')
      notifyAlert('Google sign up failed !', 'ERROR')
      return
    }

    dispatch(
      register(
        googleData.profileObj.givenName,
        googleData.profileObj.email,
        password,
        'google'
      )
    )
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
      <h1>Sign Up</h1>
      <ToastContainer />
      {message && <Message variant='danger'>{message}</Message>}
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name' className='form-group'>
          <Form.Label>Enter name</Form.Label>
          <Form.Control
            required
            type='name'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
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
        <Form.Group controlId='confirmPassword' className='form-group'>
          <Form.Label>Confirm password</Form.Label>
          <Form.Control
            required
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group className='form-group' style={{ textAlign: 'center' }}>
          <Button type='submit' variant='primary' className='btn-signin col-4'>
            Sign Up
          </Button>
        </Form.Group>
        <Form.Group className='form-group' style={{ textAlign: 'center' }}>
          <GoogleLogin
            clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
            buttonText='Sign up with Google'
            onSuccess={handleGoogleSignUp}
            onFailure={handleGoogleSignUp}
            cookiePolicy={'single_host_origin'}
          />
        </Form.Group>
      </Form>

      <Row className='py-3'>
        <Col style={{ textAlign: 'center' }}>
          Already registered?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Sign in
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen
