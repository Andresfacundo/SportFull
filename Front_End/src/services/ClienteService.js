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

    // Obtener datos del usuario autenticado usando el token
    getUserData(token) {
        return axios.get(api_base + "/user-data", {
            headers: {
                Authorization: `Bearer ${token}` // Enviar el token en la cabecera
            }
        });
    }

    // Cerrar sesión (opcional, si el backend tiene un endpoint para esto)
    logout() {
        localStorage.removeItem('token'); // Elimina el token del almacenamiento local
        localStorage.removeItem('nombreUsuario'); // Elimina los datos del usuario
    }

    // Actualizar los datos del usuario autenticado
    updateUserData(token, userData) {
        return axios.put(api_base + "/update-user", userData, {
            headers: {
                Authorization: `Bearer ${token}` // Enviar el token en la cabecera
            }
        });
    }

    // Verifica si el usuario está autenticado
    isAuthenticated() {
        return !!localStorage.getItem('token'); // Devuelve true si hay un token almacenado
    }

    // Obtener el token del usuario autenticado
    getToken() {
        return localStorage.getItem('token'); // Devuelve el token almacenado
    }

    // Obtener el nombre del usuario autenticado
    getUserName() {
        return localStorage.getItem('nombreUsuario'); // Devuelve el nombre almacenado
    }
}

export default new ClienteService();
