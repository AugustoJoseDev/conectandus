import React, { useEffect, useState } from 'react'
import api from '../../../services/api'

import './style.css'

function Dashboard() {

    const [rows, setRows] = useState([])

    useEffect( () => (
        async ()=>{

            if(rows.length) return

            const response = await api.get('/orders')
            
            setRows([])

            if(response.status < 200 || response.status >= 300){
                return
            }

            const dados = response.data.orders

            const newRows = []

            dados.forEach( each => {

                const ts = each.createdAt
                const description = each.description
                 const user = each.user

                each.equipments.forEach(e => {

                    if(e.repairNeed){

                        const equipment = e.equipmentType.equipmentType

                        const row = [equipment,description , user.fullname, user.email, ts ]

                        newRows.push(row)

                    }
                })


            })


            setRows(newRows)

        })(),[rows])



    return (
        <div className="main-dashboard">
            <table>
                <thead>
                    <th>Equipamento</th>
                    <th>Descrição</th>
                    <th>Nome</th>
                    <th>E-Mail</th>
                    <th>Data e hora</th>
                </thead>
                {
                    rows.map(row => (
                        <tr>
                            {row.map(col => <td>{col}</td>)}
                        </tr>
                        
                    ))
                }
            </table>
        </div>
    )
}

export default Dashboard