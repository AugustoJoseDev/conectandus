import React from 'react'
import Background from '../../components/Background'
import NavBar from '../../components/NavBar/intex'

import './style.css'

function Common({ children }) {
    return (
        <>
            <Background />

            <NavBar />

            {children }
        </>
    )
}

export default Common