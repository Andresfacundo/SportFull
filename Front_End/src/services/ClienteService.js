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

    // Actualizar los datos del cliente
    updateClient(id, updatedUser) {
        const token = localStorage.getItem('token'); // Obtén el token de autenticación
        return axios.patch(`http://localhost:8080/client/update/${id}`, updatedUser, {
            headers: {
                'Authorization': `Bearer ${token}` // Incluye el token en el encabezado
            }
        });
    }

    // Actualizar los datos del empresa
    updateCompany(id, updatedUser) {
        const token = localStorage.getItem('token'); // Obtén el token de autenticación
        return axios.patch(`http://localhost:8080/admin/update/${id}`, updatedUser, {
            headers: {
                'Authorization': `Bearer ${token}` // Incluye el token en el encabezado
            }
        });
    }

    //Actualizar datos del Gestor
    updateGestor(id, updatedUser) {
        const token = localStorage.getItem('token'); // Obtén el token de autenticación
        return axios.patch(`http://localhost:8080/admin/gestor/update/${id}`, updatedUser, {
            headers: {
                'Authorization': `Bearer ${token}` // Incluye el token en el encabezado
            }
        });
    }

    //verificar email
    verifyEmail = (verificationToken) => {
        return axios.get(`http://localhost:8080/auth/verify?token=${verificationToken}`);
    };

    // Método para verificar el correo electrónico usando el token
    verifyEmail(token) {
        return axios.post(`http://localhost:8080/verify-email?token=${token}`);
    }

}

export default new ClienteService();