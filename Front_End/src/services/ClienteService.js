import axios from 'axios';

const api_base = "http://localhost:8080/auth";

class ClienteService {
    createUser(user) {
        return axios.post(api_base + "/register", user);
    }

    login(credentials) {
        return axios.post(api_base + "/login", credentials);
    }
}

export default new ClienteService();