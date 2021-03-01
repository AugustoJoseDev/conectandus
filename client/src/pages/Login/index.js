import React from 'react'
import { Redirect } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthProvider'
import RoundSubmit from './RoundSubmit'
import PromptBox from '../../components/Form/PromptBox'
import './style.css'

function Login() {
    const { signed, errored, error, resetError, signIn } = useAuth()
    // const [login,setLogin]

    function handleSignIn(e) {
        try {
            e.preventDefault()

            const login = document.querySelector("#login").value
            const password = document.querySelector("#password").value
            signIn({ login, password })

        } catch (error) {
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

            <form className="form" onSubmit={ handleSignIn }>
                <input id="login" className="input" type="text" align="center" placeholder="E-Mail ou CPF" onKeyDown={ handleKeyDown } required />
                <input id="password" className="input" type="password" align="center" placeholder="Senha" onKeyDown={ handleKeyDown } required />
                <RoundSubmit value="Entrar" />
            </form>
            <p className="forgot" align="center"><a href="#">Esqueceu a senha?</a></p>

        </div>
    )

}

export default Login