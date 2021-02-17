import React from 'react'

import './style.css'

const NavBar = ({ children, ...props }) => {

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
            {children }
            <a href="javascript:void(0);" className="icon" onClick={ expand }>
                <i className="fa fa-bars"></i>
            </a>
        </div>
    )
}

export default NavBar