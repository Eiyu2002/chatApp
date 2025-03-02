import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://chatapp-production-b82e.up.railway.app/api',
    withCredentials: true
})


export default instance