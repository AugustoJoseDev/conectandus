import api from './api'

export async function signIn({ login, password }) {
    try {

        const response = await api.post('/auth/authenticate', {}, {
            auth: {
                username: login,
                password
            }
        })

        const { status, data: { error = 'Erro inesperado' } } = response

        if (200 >= status && status <= 299) {
            return { status, ...response.data }
        }

        return { status, error }
    } catch (error) {
        return { status: 400, error }
    }
}