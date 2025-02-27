import axios from 'axios'

const instance = axios.create({
    baseURL: 'chatapp-production-b82e.up.railway.app/api',
    withCredentials: true
})


export default instance