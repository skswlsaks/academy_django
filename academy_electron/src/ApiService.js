import axios from 'axios';
import API_URL from './config';
const URL = "http://" + API_URL;

export class ApiService {
    getUser(authHeader){
        return axios.get(`${URL}/api/auth/user/`, authHeader);
    }

    login(body){
        return axios.post(`${URL}/api/auth/login/`, body);
    }

    register(body){
        return axios.post(`${URL}/api/users/`, body);
    }

    logout(authHeader){
        return axios.post(`${URL}/api/auth/logout/`, null, authHeader);
    }
}