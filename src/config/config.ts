import axios from 'axios'
import env from '../env/env'
const api = axios.create({
  baseURL: env.baseURL,
  headers: {
    Accept: 'application/json'
  }
})


export default api
