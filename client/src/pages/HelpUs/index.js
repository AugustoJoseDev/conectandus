import React from 'react'
import AnchorButton from '../../components/Form/AnchorButton'
import Footer from '../../components/Footer'

import './style.css'

function HelpUs() {

    return (
        <>
            <div className="helpus-wrapper">
                <h2>Agradecemos desde já seu apoio, se escaneado com um aplicativo do seu banco ou conta digital o QR code abaixo o levará para o local de transação!</h2>
                <img src="/resources/pix.jpeg" alt="QR Pix" />

                <AnchorButton to="/">Voltar</AnchorButton>
            </div>

            <Footer />
        </>
    )
}

export default HelpUs