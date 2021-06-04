import React, { useEffect, useState } from 'react'
import api from '../../../services/api'

import './style.css'

function Repair() {

    const [ rows, setRows ] = useState(null)
    const [ update, setUpdate ] = useState(true)



    useEffect(() => {

        if (rows !== null && !update) return

        (async () => {

            const response = await api.get('/orders')

            if (response.status < 200 || response.status >= 300) {
                return
            }

            const dados = response.data.orders

            const newRows = []

            dados.forEach(each => {

                const ts = each.createdAt
                const description = each.description
                const user = each.user

                each.equipments.forEach(e => {

                    if (e.repairNeed) {

                        const equipment = e.equipmentType.equipmentType

                        const row = [ equipment, description, user.fullname, user.email, ts ]

                        newRows.push([ { order: each, equipment: e }, row ])

                    }
                })

            })


            setRows(newRows)
            setUpdate(false)

        })()
    }, [ rows, update ])


    async function handleSolve({ order, equipment }) {


        const response = await api.put(`/orders/${ order._id }/equipments/${ equipment._id }`, {

            repairNeed: false

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
                    <th>Equipamento</th>
                    <th>Descrição</th>
                    <th>Nome</th>
                    <th>E-Mail</th>
                    <th>Data e hora</th>
                    <th>Resolver</th>
                </thead>
                {
                    rows ? rows.map(([ { order, equipment }, row ]) => (
                        <tr>
                            {row.map(col => <td>{ col }</td>) }
                            <td>
                                <center>
                                    <button onClick={ () => handleSolve({ order, equipment }) }>Resolver</button>
                                </center>
                            </td>
                        </tr>
                    )) : null
                }
            </table>
        </div>
    )
}

export default Repair