import React from 'react'
import AuthProvider from '../contexts/AuthProvider'
import Routes from '../routes'
import Background from '../components/Background'

import './style.css'
import NavBar from '../components/NavBar/intex'

const App = () => (
    <div className="app">

        <Background />

        <NavBar>
            <a href="/" target="_self" rel="next">Inicio</a>
            <a href="#" target="_self" rel="next">Doações</a>
            <a href="/login" target="_self" rel="next">Login</a>
        </NavBar>

        <AuthProvider>
            <Routes />
        </AuthProvider>
    </div>
)

export default App