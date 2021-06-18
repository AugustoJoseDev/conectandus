import React from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'
import Donate from '../pages/Donate'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Offer from '../pages/Offer'
import HelpUs from '../pages/HelpUs'
import PageRoute from './PageRoute'
import ProtectedRoute from './ProtectedRoute'
import Request from '../pages/Request'
import Repair from '../pages/Admin/Repair'
import Matches from '../pages/Admin/Matches'
import Requests from '../pages/Admin/Requests'

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <PageRoute exact path="/" component={ () => <Home /> } />
            <PageRoute exact path="/login" component={ () => <Login /> } />
            <PageRoute exact path="/helpus" component={ () => <HelpUs /> } />
            <PageRoute exact path="/donate" component={ () => <Donate /> } />
            <ProtectedRoute exact path="/request" component={ () => <Request /> } />
            <ProtectedRoute exact path="/offer" component={ () => <Offer /> } />
            <ProtectedRoute exact path="/admin/repair" component={ () => <Repair /> } />
            <ProtectedRoute exact path="/admin/requests" component={ () => <Requests /> } />
            <ProtectedRoute exact path="/admin/matches" component={ () => <Matches /> } />
        </Switch>
    </BrowserRouter>
)

export default Routes