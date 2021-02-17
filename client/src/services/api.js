import axios from 'axios'
import { apiURL } from '../config/api.json'

const api = axios.create({
    baseURL: apiURL
})

export default api