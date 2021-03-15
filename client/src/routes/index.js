import React from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'
import Donate from '../pages/Donate'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Order from '../pages/Order'
import HelpUs from '../pages/HelpUs'
import PageRoute from './PageRoute'
import ProtectedRoute from './ProtectedRoute'
import Request from '../pages/Request'

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <PageRoute exact path="/" component={ () => <Home /> } />
            <PageRoute exact path="/login" component={ () => <Login /> } />
            <PageRoute exact path="/helpus" component={ () => <HelpUs /> } />
            <PageRoute exact path="/donate" component={ () => <Donate /> } />
            <ProtectedRoute exact path="/request" component={ () => <Request /> } />
            <ProtectedRoute exact path="/order" component={ () => <Order /> } />
        </Switch>
    </BrowserRouter>
)

export default Routes