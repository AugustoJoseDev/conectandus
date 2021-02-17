import React from 'react'
import { Route } from 'react-router-dom'
import Common from '../pages/Common'

const PageRoute = ({ component: Component, ...props }) => (
    <Route component={ () => <Common><Component /></Common> } { ...props } />
)

export default PageRoute