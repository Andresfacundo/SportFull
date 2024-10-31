import axios from 'axios';

const API_URL = "http://localhost:8080/auth";

class ClienteService {

    // Crear un nuevo usuario
    createUser(user) {
        return axios.post(API_URL + "/register", user);
    }

    // Iniciar sesión
    login(credentials) {
        return axios.post(API_URL + "/login", credentials);
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
    verifyEmail = (token) => {
        return axios.get(`${API_URL}/verify?token=${token}`);
    };

    // Método para validar la contraseña
    validatePassword(id, data) {
        return axios.post(`http://localhost:8080/security?idUser=${id}`, data);
    }

    // Actualiza este método para enviar los servicios seleccionados en el cuerpo de la solicitud
    createField(cancha, empresaId) {
        // Asegúrate de pasar `selectedServices` en el cuerpo junto con los demás datos
        return axios.post(`http://localhost:8080/fields/create?empresaId=${empresaId}`, cancha);
    }

    // Eliminar una cancha
    deleteField(fieldId, empresaId) {
        const token = localStorage.getItem('token'); // Obtén el token de autenticación
        return axios.delete(`http://localhost:8080/fields/delete`, {
            headers: {
                'Authorization': `Bearer ${token}` // Incluye el token en el encabezado
            },
            params: {
                fieldId: fieldId,
                empresaId: empresaId
            }
        });
    }

    // Método para actualizar una cancha
    updateField(fieldId, updatedField, empresaId) {
        const token = localStorage.getItem('token'); // Obtén el token de autenticación
        return axios.put(`http://localhost:8080/fields/update`, updatedField, {
            headers: {
                'Authorization': `Bearer ${token}` // Incluye el token en el encabezado
            },
            params: {
                fieldId: fieldId,
                empresaId: empresaId
            }
        });
    }

    // Método para consultar cancha por ID
    getFieldById(fieldId) {
        return axios.get(`http://localhost:8080/fields/findById/${fieldId}`);
    }

}

export default new ClienteService();