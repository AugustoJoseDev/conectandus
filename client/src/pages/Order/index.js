import React, { useEffect, useState } from 'react'
import { Form } from '@unform/web'
import Submit from '../../components/Form/Submit'

import './style.css'
import TextArea from '../../components/Form/TextArea'
import CheckBox from '../../components/Form/CheckBox'
import api from '../../services/api'

function Order() {

    const [equipments, setEquipments] = useState([])

    useEffect( () => (
        async ()=>{

            if(equipments.length) return

            const response = await api.get('/equipments')
            
            if(response.status < 200 || response.status >= 300){
                return
            }

            setEquipments(
                response.data.equipments.map(e => ({
                    id: e._id,
                    value: e.equipmentType,
                    label: e.equipmentType
                }))
            )


        })(),[equipments]
    )

    function handleSubmit(data, { reset }) {
        try {

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
                <p><label htmlFor="descriprionId">Descrição do equipamento</label></p>
                <TextArea required id="descriprionId" name="description" placeholder="Descreva brevemente as características gerais do aparelho, tal como possíveis defeitos." ></TextArea>

                <p><label>Informe o(s) tipo(s) de equipamento(s) que deseja doar:</label></p>

                <CheckBox name="equipments" options={ equipments } />

                <Submit value="Doar!" />

            </Form>
        </div>
    )

}

export default Order