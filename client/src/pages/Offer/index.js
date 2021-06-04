import React, { useEffect, useState } from 'react'
import { Form } from '@unform/web'
import Submit from '../../components/Form/Submit'

import './style.css'
import TextArea from '../../components/Form/TextArea'
import CheckBox from '../../components/Form/CheckBox'
import api from '../../services/api'

function Offer() {

    const [ equipments, setEquipments ] = useState([])

    useEffect(() => (
        async () => {

            if (equipments.length) return

            const storageEquipments = localStorage.getItem('equipments')

            if (storageEquipments) setEquipments(JSON.parse(storageEquipments))

            const response = await api.get('/equipments')

            if (response.status < 200 || response.status >= 300) {

                setEquipments([])

                return
            }

            const e = response.data.equipments.map(e => ({
                id: e._id,
                value: e.equipmentType,
                label: e.equipmentType
            }))

            localStorage.setItem('equipments', JSON.stringify(e))

            setEquipments(e)


        })(), [ equipments ]
    )


    async function handleSubmit(data, { reset }) {
        try {

            const response = await api.post('/offers', {
                description: data.description,
                equipments: data.equipments.map(e => ({
                    equipmentType: e,
                    repairNeed: data.repairNeeds.includes(e)
                }))
            })

            if (response.status < 200 || response.status >= 300) {
                alert("Algo deu errado!\n" + response.data.error)
                return
            }


            reset()

            alert("oferta de doação enviada!")

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

                <div className="checkbox-wrapper">

                    <div className="left">
                        <p>Equipamento:</p>
                        <CheckBox name="equipments" options={ equipments } />
                    </div>
                    <div className="right">
                        <p>Precisa de manutenção?</p>
                        <CheckBox name="repairNeeds" options={ equipments.map(({ id, value }) => ({

                            id: `${ id }_repairNeed`,
                            value,
                            label: 'Sim'

                        })) } />
                    </div>

                </div>

                <Submit value="Doar!" />

            </Form>
        </div>
    )

}

export default Offer