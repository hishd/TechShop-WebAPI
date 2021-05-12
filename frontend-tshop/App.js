import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Header from './components/Header'
import Footer from './components/Footer'
import HomeScreen from './Screens/HomeScreen'
import ProductScreen from './Screens/ProductScreen'
import CartScreen from './Screens/CartScreen'
import LoginScreen from './Screens/LoginScreen'
import RegisterScreen from './Screens/RegisterScreen'
import ProfileScreen from './Screens/ProfileScreen'
import ShippingScreen from './Screens/ShippingScreen'
import PaymentScreen from './Screens/PaymentScreen'
import PlaceOrderScreen from './Screens/PlaceOrderScreen'
import OrderScreen from './Screens/OrderScreen'
import UserListScreen from './Screens/UserListScreen'
import { ConfirmProvider } from 'material-ui-confirm'
import ProductListScreen from './Screens/ProductListScreen'
import ProductEditScreen from './Screens/ProductEditScreen'
import OrderListScreen from './Screens/OrderListScreen'

// created 

const App = () => {
    return (
        <ConfirmProvider>
            <Router>
                <>
                    <Header />
                    <main className='py-3'>
                        <Container>
                            <Route path='/search/:keyword' component={HomeScreen} exact />
                            {/* Pagination routes */}
                            <Route path='/page/:pageNumber' component={HomeScreen} exact />
                            <Route
                                path='/search/:keyword/page/:pageNumber'
                                component={HomeScreen}
                                exact
                            />
                            <Route
                                path='/admin/productList/:pageNumber'
                                component={ProductListScreen}
                                exact
                            />
                        
                            <Route path='/' component={HomeScreen} exact />
                            <Route path='/product/:id' component={ProductScreen} />
                            <Route path='/cart/:id?' component={CartScreen} />
                            <Route path='/login' component={LoginScreen} />
                            <Route path='/register' component={RegisterScreen} />
                            <Route path='/profile' component={ProfileScreen} />
                            <Route path='/shipping' component={ShippingScreen} />
                            <Route path='/payment' component={PaymentScreen} />
                            <Route path='/placeorder' component={PlaceOrderScreen} />
                            <Route path='/order/:id' component={OrderScreen} />
                            <Route path='/admin/userList' component={UserListScreen} />
                            <Route
                                path='/admin/productList'
                                component={ProductListScreen}
                                exact
                            />
                            <Route
                                path='/admin/product/:id/edit'
                                component={ProductEditScreen}
                            />
                            <Route path='/admin/orderList' component={OrderListScreen} />
                        </Container>
                    </main>
                    <Footer />
                </>
            </Router>
        </ConfirmProvider>
    )
}

export default App
