import React from 'react'
import RoundButton from '../../components/Form/RoundButton'
import { useAuth } from '../../contexts/AuthProvider'

import './style.css'

function Home() {

    return (
        <div className="menu">
            <RoundButton href="#">DOAR</RoundButton>
            <img src="/resources/pc-icon.png" alt="icone pc" />
            <RoundButton href="#">RECEBER</RoundButton>
        </div>
    )
}

export default Home