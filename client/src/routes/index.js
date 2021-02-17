import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Common from '../pages/Common'
import Home from '../pages/Home'
import Login from '../pages/Login'
import PageRoute from './PageRoute'

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <PageRoute exact path="/" component={ () => <Home /> } />
            <PageRoute exact path="/login" component={ () => <Login /> } />
        </Switch>
    </BrowserRouter>
)

export default Routes