import React, { useEffect, useState } from 'react'
import api from '../../../services/api'

import './style.css'

function Requests() {

    const [ rows, setRows ] = useState(null)
    const [ update, setUpdate ] = useState(true)



    useEffect(() => {

        if (rows !== null && !update) return

        (async () => {

            const response = await api.get('/requests')

            if (response.status < 200 || response.status >= 300) {
                return
            }

            const dados = response.data.requests

            const newRows = []

            dados.forEach(each => {

                const ts = each.createdAt
                const description = each.description
                const user = each.user

                each.equipments.forEach(e => {

                    const equipment = e.equipmentType.equipmentType

                    const row = [ equipment, description, user.fullname, user.email, new Date(ts).toLocaleString() ]

                    newRows.push([ { request: each, equipment: e }, row ])

                })

            })


            setRows(newRows)
            setUpdate(false)

        })()
    }, [ rows, update ])

    return (
        <div className="main-dashboard">
            <table>
                <thead>
                    <th>Equipamento</th>
                    <th>Descrição do pedido</th>
                    <th>Nome</th>
                    <th>E-Mail</th>
                    <th>Data e hora</th>
                </thead>
                {
                    rows ? rows.map(([ { request, equipment }, row ]) => (
                        <tr>
                            { row.map(col => <td>{ col }</td>) }
                        </tr>
                    )) : null
                }
            </table>
        </div>
    )
}

export default Requests