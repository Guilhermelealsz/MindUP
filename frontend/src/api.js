import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5010/',
    headers:{
        "x-access-token": localStorage.getItem("token") || ""
    }
});

export default api;