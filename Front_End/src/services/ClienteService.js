import axios from 'axios';

const api_base = "http://localhost:8080/auth";

class ClienteService {
    createUser(user) {
        return axios.post(api_base + "/register", user);
    }

    login(credentials) {
        return axios.post(api_base + "/login", credentials);
    }

    // Nuevo método para obtener datos del usuario autenticado
    getUserData(token) {
        return axios.get(api_base + "/user-data", {
            headers: {
                Authorization: `Bearer ${token}` // Enviar el token en la cabecera
            }
        });
    }
}

export default new ClienteService();