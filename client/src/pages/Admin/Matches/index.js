import React, { useEffect, useState } from 'react'
import api from '../../../services/api'

import './style.css'

function Matches() {

    const [ rows, setRows ] = useState([])

    useEffect(() => (
        async () => {

            if (rows.length) return

            const response = await api.get('/matches')

            setRows([])

            if (response.status < 200 || response.status >= 300) {
                return
            }

            const dados = response.data.matches.map((match) => {

                const { equipmentType, requestEquipment, orderEquipment } = match

                return [ match, [

                    equipmentType.equipmentType,
                    requestEquipment.request.description,
                    orderEquipment.order.description,
                    requestEquipment.request.user.fullname,
                    orderEquipment.order.user.fullname,
                    requestEquipment.createdAt,
                    orderEquipment.createdAt
                ] ]

            }).map(match => Object.values(match))

            setRows(dados)

        })(), [ rows ])


    async function handleSolve({ match }) {


        // const response = await api.put(`/orders/${ order._id }/equipments/${ equipment._id }`, {

        //     repairNeed: false

        // })

        // if (response.status >= 200 && response.status < 300) {
        //     alert('O reparo do equipamento foi marcado como resolvido.')
        // }

    }


    return (
        <div className="main-dashboard">
            <table>
                <thead>
                    <th>Tipo de equipamento</th>
                    <th>Descrição do pedido</th>
                    <th>Descrição da intenção</th>
                    <th>Solicitante</th>
                    <th>Doador</th>
                    <th>Data Hora do pedido</th>
                    <th>Data Hora da intenção</th>
                    <th>Confirmar doação</th>
                </thead>
                {
                    rows.map(([ { match }, row ]) => (
                        <tr>
                            {row.map(col => <td>{ col }</td>) }
                            <td>
                                <center>
                                    <button onClick={ () => handleSolve({ match }) }>Confirmar doação</button>
                                </center>
                            </td>
                        </tr>
                    ))
                }
            </table>
        </div>
    )
}

export default Matches