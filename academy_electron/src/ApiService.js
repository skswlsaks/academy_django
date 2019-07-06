import axios from 'axios';
const API_URL = 'http://' + (process.env.REACT_APP_API_URL || '127.0.0.1:8000');
//const API_URL = 'http://' + (process.env.REACT_APP_API_URL || 'www.tonyscoding.com:8000');

export class ApiService {
    getUser(authHeader){
        return axios.get(`${API_URL}/api/auth/user/`, authHeader);
    }

    login(body){
        return axios.post(`${API_URL}/api/auth/login/`, body);
    }

    register(body){
        return axios.post(`${API_URL}/api/users/`, body);
    }

    logout(authHeader){
        return axios.post(`${API_URL}/api/auth/logout/`, null, authHeader);
    }
}