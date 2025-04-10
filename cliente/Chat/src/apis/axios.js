import axios from 'axios'
let url = "";

if(import.meta.env.VITE_PROD_ENV === "produccion"){
    url = `chatapp-production-b82e.up.railway.app/api`;
}else{
    url = 'http://localhost:3000/api'
}

const instance = axios.create({
    baseURL: url,
    withCredentials: true
})


export default instance