import axios from 'axios';

const api_base = "http://localhost:8080/auth";

class ClienteService {

    // Crear un nuevo usuario
    createUser(user) {
        return axios.post(api_base + "/register", user);
    }

    // Iniciar sesión
    login(credentials) {
        return axios.post(api_base + "/login", credentials);
    }

    // Cerrar sesión (opcional, si el backend tiene un endpoint para esto)
    logout() {
        localStorage.removeItem('token'); // Elimina el token del almacenamiento local
        localStorage.removeItem('user'); // Elimina los datos del usuario
    }

    // Actualizar los datos del usuario autenticado
    // services/ClienteService.js

    updateUser(id, updatedUser) {
        const token = localStorage.getItem('token'); // Obtén el token de autenticación
        return axios.put(`${api_base}/client/${id}`, updatedUser, {
            headers: {
                'Authorization': `Bearer ${token}` // Incluye el token en el encabezado
            }
        });
    }

}

export default new ClienteService();