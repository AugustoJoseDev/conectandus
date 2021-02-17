import React from 'react'
import { Redirect } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthProvider'

import PromptBox from '../../components/Form/PromptBox'

import './style.css'

function Login({ next = "/" }) {
    const { signed, signIn } = useAuth()

    function handleSignIn(e) {
        try {
            e.preventDefault()

            const login = document.querySelector("#login").value
            const password = document.querySelector("#password").value
            signIn({ login, password })

        } catch (error) {
            document.querySelector('.prompt-box-wrapper').innerHTML = <PromptBox message={ error } />
        }
    }

    return (
        <div className="login">
            <p className="singin" align="center">Entrar</p>

            <div className="prompt-box-wrapper"></div>

            <form className="form" onSubmit={ handleSignIn }>
                <input id="login" className="un" type="text" align="center" placeholder="E-Mail ou CPF" required />
                <input id="password" className="pass" type="password" align="center" placeholder="Senha" required />
                <input type="submit" align="center" value="Entrar" />
                <p className="forgot" align="center"><a href="#">Esquecceu a senha?</a></p>
            </form>
        </div>
    )

}

export default Login