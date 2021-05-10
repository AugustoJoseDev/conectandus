import React from 'react'
import { Route } from 'react-router-dom'
import { useAuth } from '../contexts/AuthProvider'
import Common from '../pages/Common'
import Login from '../pages/Login'

const ProtectedRoute = ({ component: Component, ...props }) => {

    const { signed } = useAuth()


    return (
        <Route component={ () => (
            <Common>
                {signed ? <Component /> : <Login /> }
            </Common>
        ) } { ...props } />
        
    )
}

export default ProtectedRoute