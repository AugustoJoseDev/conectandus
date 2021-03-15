import React from 'react'
import { Form } from '@unform/web'
import Submit from '../../components/Form/Submit'

import './style.css'
import TextArea from '../../components/Form/TextArea'
import CheckBox from '../../components/Form/CheckBox'
import api from '../../services/api'

function Order() {

    function handleSubmit(data, { reset }) {
        try {

            data.equipment = data.equipment.join(', ')

            api.post('/orders', data)

            reset()

            alert("Intenção de doação enviada!")

        } catch (error) {

        }
    }

    return (
        <div className="request">
            <h1>Você escolheu Doar equipamento!</h1>
            <h2>Agora só falta um pouquinho</h2>

            <Form onSubmit={ handleSubmit }>
                <p><label for="descriprionId">Descrição do equipamento</label></p>
                <TextArea required id="descriprionId" name="description" placeholder="Descreva brevemente as características gerais do aparelho, tal como possíveis defeitos." ></TextArea>

                <p><label>Informe o(s) tipo(s) de equipamento(s) que deseja doar:</label></p>

                <CheckBox name="equipment" options={ [
                    { id: 'desktop', value: 'desktop', label: 'Computador de mesa' },
                    { id: 'laptop', value: 'notebook', label: 'Laptop' },
                    { id: 'smartphone', value: 'smartphone', label: 'Celular' },
                    { id: 'perifericals', value: 'perifericals', label: 'Periféricos (mouse, teclado, câmera, etc...)' },
                    { id: 'pieces', value: 'pieces', label: 'Peças (componentes internos)' }
                ] } />

                <Submit value="Doar!" />

            </Form>
        </div>
    )

}

export default Order