import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthProvider'

import './style.css'

const NavBar = ({ ...props }) => {

    const { signed, signOut } = useAuth()

    function handleSignOut() {
        signOut()
    }


    function expand() {
        const nav = document.querySelector('.navbar')
        if (nav.classList.contains('responsive')) {
            nav.classList.remove('responsive')
        } else {
            nav.classList.add('responsive')
        }
    }

    return (
        <div className="navbar" { ...props }>
            <div className="left">

                <Link to="/">Inicio</Link>
                <Link to="/donate">Doar</Link>
                <Link to="/request">Receber</Link>

            </div>
            <div className="right">

                { !signed ? (
                    <Link to="/login">Login</Link>) :
                    <a href="javascript:void(0);" onClick={ handleSignOut }>Logout</a>
                }

            </div>
            <a href="javascript:void(0);" className="icon" onClick={ expand }>
                <i className="fa fa-bars"></i>
            </a>
        </div>
    )
}

export default NavBar