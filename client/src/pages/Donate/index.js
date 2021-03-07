import React from 'react'
import AnchorButton from '../../components/Form/AnchorButton'

import './style.css'

function Donate() {

    return (
        <div className="donate">
            <h1>Você escolheu Doar!</h1>
            <h2>Como gostaria de ajudar?</h2>

            <AnchorButton to="#">EQUIPAMENTO</AnchorButton>
            <AnchorButton to="#">APOIAR</AnchorButton>
        </div>
    )
}

export default Donate
