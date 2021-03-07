import React from 'react'
import { Redirect } from 'react-router-dom'
import {Form} from '@unform/web'
import { useAuth } from '../../contexts/AuthProvider'
import Submit from '../../components/Form/Submit'
import PromptBox from '../../components/Form/PromptBox'

import './style.css'
import Input from '../../components/Form/Input'

function Login() {
    const { signed, errored, error, resetError, signIn } = useAuth()

    function handleSignIn(data) {
        try {
            signIn(data)
        } catch (error) {
            console.error(error);
        }
    }

    function handleKeyDown(e) {
        resetError()
    }

    if (signed)
        return (
            <Redirect to="/" />
        )

    return (
        <div className="login">
            <p className="singin" align="center">Entrar</p>

            { errored ? (<PromptBox>{ error }</PromptBox>) : undefined }

            <Form className="form" onSubmit={ handleSignIn }>
                <Input name="login" type="text" placeholder="E-Mail ou CPF" onKeyDown={ handleKeyDown } required />
                <Input name="password" type="password" placeholder="Senha" onKeyDown={ handleKeyDown } required />
                <Submit value="Entrar" />
            </Form>
            <p className="forgot" align="center"><a href="#">Esqueceu a senha?</a></p>

        </div>
    )

}

export default Login