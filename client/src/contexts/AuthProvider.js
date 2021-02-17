import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'
import * as auth from '../services/auth'

const AuthContext = createContext({ signed: false, user: {}, signIn: ({ login, password }) => { }, signOut: () => { } })

export default function AuthProvider({ children }) {
    const [ user, setUser ] = useState(null)

    useEffect(async () => {
        try {
            const storageToken = localStorage.getItem('token')
            const storageUser = localStorage.getItem('user')

            if (storageToken && storageUser) {
                api.defaults.headers.Authorization = `Bearer ${ JSON.parse(storageToken) }`
                setUser(JSON.parse(storageUser))
            }
        } catch (error) {
            signOut()
        }

    }, [])

    async function signIn({ login, password }) {
        const { user, token, status, error } = await auth.signIn({ login, password })

        api.defaults.headers.Authorization = `Bearer ${ token }`
        localStorage.setItem('token', JSON.stringify(token))
        localStorage.setItem('user', JSON.stringify(user))
        setUser(user)
    }

    function signOut() {
        api.defaults.headers.Authorization = undefined
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={ { signed: !!user, user, signIn, signOut } }>
            {children }
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}