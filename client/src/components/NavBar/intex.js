import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthProvider'

import './style.css'

const NavBar = ({ ...props }) => {

    const { user, signed, signOut } = useAuth()

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

    console.log(user)

    return (
        <div className="navbar" { ...props }>
            <div className="left">

                <Link to="/">Inicio</Link>
                <Link to="/order">Doar</Link>
                <Link to="/request">Solicitar</Link>
                <Link to="/helpus">Apoiar</Link>

            </div>
            <div className="right">

                { !signed ? (
                    <Link to="/login">Login</Link>) : (

                    <div className="dropdown">
                        <button className="dropbtn">{ user.fullname.split(" ")[ 0 ] }
                            &nbsp;<i className="fa fa-caret-down"></i>
                        </button>
                        <div className="dropdown-content">
                            { user.superuser ? (<>
                                <Link to="/admin/repair">Manutenção</Link>
                                <Link to="/admin/matches">Doações</Link>
                            </>) : null }
                            <a href="javascript:void(0);" onClick={ handleSignOut }>Sair</a>
                        </div>
                    </div>

                )
                }

            </div>
            <a href="javascript:void(0);" className="icon" onClick={ expand }>
                <i className="fa fa-bars"></i>
            </a>
        </div>
    )
}

export default NavBar