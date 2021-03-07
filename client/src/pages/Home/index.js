import React from 'react'
import AnchorButton from '../../components/Form/AnchorButton'
import Footer from '../../components/Footer'

import './style.css'

function Home() {

    return (
        <>
            <div className="menu">
                <AnchorButton to="/donate">DOAR</AnchorButton>
                <img src="/resources/pc-icon.png" alt="icone pc" />
                <AnchorButton to="/request">RECEBER</AnchorButton>
            </div>

            <Footer />
        </>
    )
}

export default Home