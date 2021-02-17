import React from 'react'
import AnchorButton from '../../components/Form/AnchorButton'
import { useAuth } from '../../contexts/AuthProvider'

import './style.css'

function Home() {
    const { signed, signOut } = useAuth()

    function handleSignOut() {
        signOut()
    }

    return (
        <div class="menu">
            <AnchorButton href="#">DOAR</AnchorButton>
            <img src="/resources/pc-icon.png" alt="icone pc" />
            <AnchorButton href="#">RECEBER</AnchorButton>
        </div>
    )
}

export default Home