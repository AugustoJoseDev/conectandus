import React, { useEffect, useState } from 'react'
import api from '../../../services/api'

import './style.css'

function Matches() {

    const [ rows, setRows ] = useState(null)
    const [ update, setUpdate ] = useState(true)


    useEffect(() => {

        if (!update && rows !== null) return

        (async () => {
            const response = await api.get('/matches/list')

            if (response.status < 200 || response.status >= 300) {
                return
            }

            console.log(response.data.matches)

            const dados = response.data.matches.map((match) => {

                const { request, requestEquipment, offer, offerEquipment, status } = match

                console.log(match)

                return [ match, [

                    offerEquipment.equipmentType.equipmentType,
                    request.description,
                    offer.description,
                    request.user.fullname,
                    offer.user.fullname,
                    requestEquipment.createdAt,
                    offerEquipment.createdAt,
                    status
                ] ]

            }).map(match => Object.values(match))

            setRows(dados)
            setUpdate(false)

        })()
    }, [ rows, update ])


    async function handleSelect({ match }) {


        const response = await api.post(`/matches`, {
            request: match.request._id,
            offer: match.offer._id,
            requestEquipment: match.requestEquipment._id,
            offerEquipment: match.offerEquipment._id,
        })

        if (response.status < 200 || response.status >= 300) {
            alert('Não foi possivel alterar o status da doação.')
        }

        setUpdate(true)
    }

    async function handleConfirm({ match }) {


        const response = await api.put(`/matches/${ match._id }`, {
            status: 'Efetuada'
        })

        if (response.status < 200 || response.status >= 300) {
            alert('Não foi possivel alterar o status da doação.')
        }

        setUpdate(true)
    }

    return (
        <div className="main-dashboard">
            <table>
                <thead>
                    <th>Tipo de equipamento</th>
                    <th>Descrição do pedido</th>
                    <th>Descrição da oferta</th>
                    <th>Solicitante</th>
                    <th>Doador</th>
                    <th>Data Hora do pedido</th>
                    <th>Data Hora da oferta</th>
                    <th>Status</th>
                    <th>Alterar status</th>
                </thead>
                {
                    rows ? rows.map(([ match, row ]) => (
                        <tr>
                            {row.map(col => <td>{ col }</td>) }
                            <td>
                                <center>
                                    { (() => {
                                        switch (match.status) {
                                            case "Aplicada":

                                                return <button onClick={ () => handleConfirm({ match }) }>Confirmar doação</button>

                                            case "Em análise":

                                                return <button onClick={ () => handleSelect({ match }) }>Aplicar doação</button>

                                                break
                                            default:
                                                break
                                        }
                                    })() }
                                </center>
                            </td>
                        </tr>
                    )) : null
                }
            </table>
        </div>
    )
}

export default Matches