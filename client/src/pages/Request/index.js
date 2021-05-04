import React, { useEffect, useRef, useState } from 'react'
import { Form } from '@unform/web'
import Submit from '../../components/Form/Submit'

import './style.css'
import TextArea from '../../components/Form/TextArea'
import CheckBox from '../../components/Form/CheckBox'
import api from '../../services/api'
import { Redirect } from 'react-router'

function Request() {

    const [equipments, setEquipments] = useState([])

    useEffect( () => (
        async ()=>{

            if(equipments.length) return

            const storageEquipments = localStorage.getItem('equipments')

            if(storageEquipments) setEquipments(JSON.parse(storageEquipments))

            const response = await api.get('/equipments')
            
            if(response.status < 200 || response.status >= 300){
                return
            }

            const e = response.data.equipments.map(e => ({
                id: e._id,
                value: e.equipmentType,
                label: e.equipmentType
            }))

            localStorage.setItem('equipments', JSON.stringify(e))

            setEquipments(e)


        })(),[equipments]
    )

    async function handleSubmit(data, { reset }) {
        try {

            const response = await api.post('/requests', data)

            if(response.status < 200 || response.status >= 300){
                alert("Algo deu errado!\n"+ response.data.error)
                return 
            }

            reset()

            alert("Solicitação enviada!")

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

                <p><label>Informe o(s) tipo(s) de equipamento(s) que deseja solicitar:</label></p>

                <CheckBox name="equipments" options={ equipments } />

                <Submit value="Receba!" />

            </Form>
        </div>
    )

}

export default Request