import React from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'
import Donate from '../pages/Donate'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Request from '../pages/Request'
import PageRoute from './PageRoute'
import ProtectedRoute from './ProtectedRoute'

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <PageRoute exact path="/" component={ () => <Home /> } />
            <PageRoute exact path="/login" component={ () => <Login /> } />
            <ProtectedRoute exact path="/request" component={ () => <Request /> } />
            <ProtectedRoute exact path="/donate" component={ () => <Donate /> } />
        </Switch>
    </BrowserRouter>
)

export default Routes