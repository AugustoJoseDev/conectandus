import React, { useRef } from 'react'
import { Form } from '@unform/web'
import Submit from '../../components/Form/Submit'

import './style.css'
import TextArea from '../../components/Form/TextArea'
import CheckBox from '../../components/Form/CheckBox'
import api from '../../services/api'
import { Redirect } from 'react-router'

function Request() {

    function handleSubmit(data, { reset }) {
        try {

            data.equipment = data.equipment.join(', ')

            api.post('/requests', data)

            reset()

        } catch (error) {

        }
    }

    return (
        <div className="request">
            <h1>Você escolheu Receber Doação!</h1>
            <h2>Agora só falta um pouquinho</h2>

            <Form onSubmit={ handleSubmit }>
                <p><label for="descriprionId">Descrição do equipamento</label></p>
                <TextArea required id="descriprionId" name="description" placeholder="Descreva brevemente as características nescessárias do aparelho." ></TextArea>

                <p><label>Informe o dispositivo que deseja, selecione de um até três, apenas o primeiro dos assinalados que for disponibilizado será entregue:</label></p>

                <CheckBox name="equipment" options={ [
                    { id: 'desktop', value: 'desktop', label: 'Computador' },
                    { id: 'notebook', value: 'notebook', label: 'Notebook' },
                    { id: 'smartphone', value: 'smartphone', label: 'Celular' }
                ] } />

                <Submit value="Receba!" />

            </Form>
        </div>
    )

}

export default Request