import React from 'react'
import Routes from '../routes'
import AuthProvider from '../contexts/AuthProvider'

import './style.css'

const App = () => (
    <div className="app">
        <AuthProvider>

            <Routes />

        </AuthProvider>
    </div>
)

export default App