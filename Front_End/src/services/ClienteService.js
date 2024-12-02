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

    // Crear un nuevo Gestor
    createGestor(user, adminEmpresaId) {
        // Obtén el token de autenticación si es necesario
        const token = localStorage.getItem('token');

        // Realiza una solicitud POST para crear el gestor
        return axios.post(
            `http://localhost:8080/admin/gestor/register?adminEmpresa_Id=${adminEmpresaId}`,
            user,
            {
                headers: {
                    'Authorization': `Bearer ${token}`, // Incluye el token si es necesario
                    'Content-Type': 'application/json'   // Asegura que el contenido sea JSON
                }
            }
        );
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

    //Mostrar todas la canchas
    getAllFields() {
        return axios.get("http://localhost:8080/fields/findAll");
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

    // Método para consultar gestor por ID
    getManagerById(managerId) {
        return axios.get(` http://localhost:8080/admin/gestor/find/${managerId}`);
    }

    //eliminar gestor
    deletedManager(gestorId) {
        return axios.delete(`http://localhost:8080/admin/gestor/${gestorId}`);

    }

    //actualizar gestor
    updatedManager(id, updatedManager) {
        return axios.patch(`http://localhost:8080/admin/gestor/update/${id}`, updatedManager);;

    };

    // Método para actualizar la imagen de perfil de la empresa
    updateCompanyImage(empresaId, imgPerfil) {
        const token = localStorage.getItem('token'); // Obtén el token de autenticación
        const formData = new FormData();
        formData.append("imgPerfil", imgPerfil);

        return axios.post(`http://localhost:8080/admin/actualizar-imagen/${empresaId}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`, // Incluye el token en el encabezado
                'Content-Type': 'multipart/form-data' // Asegura que el contenido sea multipart/form-data
            }
        });
    }

    // Método para actualizar la imagen de perfil de la empresa
    updateClientImage(clientId, imgPerfil) {
        const token = localStorage.getItem('token'); // Obtén el token de autenticación
        const formData = new FormData();
        formData.append("imgPerfil", imgPerfil);

        return axios.post(`http://localhost:8080/client/actualizar-imagen/${clientId}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`, // Incluye el token en el encabezado
                'Content-Type': 'multipart/form-data' // Asegura que el contenido sea multipart/form-data
            }
        });
    }

    // Método para actualizar la imagen de perfil del gestor
    updateManagerImage(managerId, imgPerfil) {
        const token = localStorage.getItem('token'); // Obtén el token de autenticación
        const formData = new FormData();
        formData.append("imgPerfil", imgPerfil);

        return axios.post(`http://localhost:8080/gestor/actualizar-imagen/${managerId}`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`, // Incluye el token en el encabezado
                'Content-Type': 'multipart/form-data' // Asegura que el contenido sea multipart/form-data
            }
        });
    }


    // Crear una reserva
    createReservation(reservation, fieldId, adminId, clientId, userEmail) {
        const token = localStorage.getItem('token'); // Obtener el token del localStorage
        return axios.post(
            `http://localhost:8080/reservas/create`, // URL del endpoint
            reservation, // Datos de la reserva
            {
                params: {
                    fieldId, // ID de la cancha
                    adminId, // ID del administrador
                    clientId, // ID del cliente
                    userEmail // Email del cliente
                },
                headers: {
                    'Authorization': `Bearer ${token}`, // Agregar el token al encabezado
                    'Content-Type': 'application/json' // Especificar que se envía JSON
                }
            }
        );
    }

    //filtrar reservas por usuario
    getReservationsByUser(userId) {
        const token = localStorage.getItem('token'); // Obtén el token de autenticación
        return axios.get(`http://localhost:8080/reservas/user?userId=${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Incluye el token en el encabezado
            }
        });
    }

    // filtrar horarios reservados por cancha
    getHorariosReservados(idCancha, fecha) {
        return axios.get(`http://localhost:8080/reservas/horarios/${idCancha}`, {
            params: { fecha }
        });
    }

    // Obtener historial de reservas por usuario
    getReservationsByUser(userId) {
        const token = localStorage.getItem('token'); // Obtén el token de autenticación
        return axios.get(`http://localhost:8080/reservas/user`, {
            params: { userId }, // Parámetro para enviar el ID del usuario
            headers: {
                'Authorization': `Bearer ${token}` // Incluye el token en el encabezado
            }
        });
    }

    // Actualizar una reserva
    updateReservation(reservationId, updates) {
        const token = localStorage.getItem('token'); // Obtén el token de autenticación
        return axios.patch(`http://localhost:8080/reservas/${reservationId}`, updates, {
            headers: {
                'Authorization': `Bearer ${token}` // Incluye el token en el encabezado
            }
        });
    }

    // Enviar petición de soporte
    sendSupportRequest(request) {
        const token = localStorage.getItem('token'); // Obtén el token de autenticación, si es necesario
        return axios.post(`http://localhost:8080/api/soporte/enviar`, request, {
            headers: {
                'Authorization': `Bearer ${token}`, // Incluye el token si el endpoint lo requiere
                'Content-Type': 'application/json'  // Asegura que el contenido sea JSON
            }
        });
    }

    
}



export default new ClienteService();