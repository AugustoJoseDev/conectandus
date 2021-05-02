import api from './api'

export async function authenticate({ login, password, token}) {
    try {

        const response = await api.post('/auth/authenticate',{}, {
            auth: login && password ? {
                username: login,
                password
            } : undefined,
            headers: token?{
                Authorization: `Bearer ${ token }`
            } : undefined
        })

        const {status, data: { error = 'Erro inesperado' } } = response

        if (200 >= status && status <= 299) {

            api.defaults.headers.Authorization = `Bearer ${  response.data.token }`

            return { status, ...response.data }
        }

        return { error }

    } catch (error) {
        return { error: error.response.data.error }
    }
}