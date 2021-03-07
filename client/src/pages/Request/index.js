import React from 'react'
import { Redirect } from 'react-router-dom'
import {Form} from '@unform/web'
import { useAuth } from '../../contexts/AuthProvider'
import Submit from '../../components/Form/Submit'
import PromptBox from '../../components/Form/PromptBox'

import './style.css'
import Input from '../../components/Form/Input'
import TextArea from '../../components/Form/TextArea'
import CheckBox from '../../components/Form/CheckBox'

function Request() {
    // const { signed, errored, error, resetError, signIn } = useAuth()

    // function handleSignIn(data) {
    //     try {
    //         signIn(data)
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // function handleKeyDown(e) {
    //     resetError()
    // }

    // if (signed)
    //     return (
    //         <Redirect to="/" />
    //     )

    return (
        <div className="request">
            <h1>Você escolheu Receber Doação!</h1>
            <h2>Agora só falta um pouquinho</h2>

            <Form>
                <p><label for="descriprionId">Descrição do equipamento</label></p>
                <TextArea id="descriprionId" name="description" placeholder="Descreva brevemente as características nescessárias do aparelho." ></TextArea>
                
                <p><label>Informe o dispositivo que deseja, selecione de um até três, apenas o primeiro dos assinalados que for disponibilizado será entregue:</label></p>
                
                <CheckBox name="equipament" value="computador" label="Computador"/>
                <CheckBox name="equipament" value="notebook" label="Notebook"/>
                <CheckBox name="equipament" value="smartphone" label="Smartphone"/>

            </Form>

            <Submit value="Receba!"/>
        </div>
    )

}

export default Request