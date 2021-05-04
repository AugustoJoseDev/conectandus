import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'
import * as auth from '../services/auth'

const AuthContext = createContext({ errored: false, error: "", signed: false, user: {}, resetError: () => { }, signIn: ({ login, password }) => { }, signOut: () => { } })

export default function AuthProvider({ children }) {
    const [ user, setUser ] = useState(null)
    const [ error, setError ] = useState(null)

    useEffect(async () => {
        try {
            const storageToken = localStorage.getItem('token')
            const storageUser = localStorage.getItem('user')


            if (storageToken && storageUser ) {
                
                setUser(JSON.parse(storageUser))

                const { user, token, error: err } = await auth.authenticate({ token: JSON.parse(storageToken) })

                if (err) {
                    setError(err)
                    setUser(null)
                    return
                }

                localStorage.setItem('token', JSON.stringify(token))
                localStorage.setItem('user', JSON.stringify(user))

                setUser(user)
                setError(null)
            }
        } catch (err) {
            signOut()
        }

    }, [])

    async function signIn({ login, password }) {
        const { user, token, error: err } = await auth.authenticate({ login, password })

        if (err) {
            setError(err)
            return
        }

        localStorage.setItem('token', JSON.stringify(token))
        localStorage.setItem('user', JSON.stringify(user))
        setUser(user)
        setError(null)
    }

    function signOut() {
        api.defaults.headers.Authorization = undefined
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
        setError(null)
    }

    function resetError() {
        setError(null)
    }

    return (
        <AuthContext.Provider value={ { errored: !!error, error, resetError, signed: !!user, user, signIn, signOut } }>
            {children }
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}