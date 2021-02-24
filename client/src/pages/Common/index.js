import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthProvider'
import Background from '../../components/Background'
import NavBar from '../../components/NavBar/intex'

import './style.css'
import Footer from '../../components/Footer'

function Common({ children }) {
    const { signed, signOut } = useAuth()

    function handleSignOut() {
        signOut()
    }

    return (
        <>
            <Background />

            <NavBar>
                <Link to="/">Inicio</Link>
                { !signed ? (
                    <Link to="/login">Login</Link>) :
                    <a href="javascript:void(0);" onClick={ handleSignOut }>Logout</a>
                }
            </NavBar>

            {children }

            <Footer />
        </>
    )
}

export default Common