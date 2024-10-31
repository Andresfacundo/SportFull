import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './UpdateField.css';
import { Header } from '../../../Components/Layouts/Header/Header';
import { NavLink, useNavigate } from 'react-router-dom';
import NavBar from '../../UI/NavBar/NavBar';
import ClienteService from '../../../services/ClienteService';

export const UpdateField = () => {
    const { id } = useParams();
    const [seleccionados, setSeleccionados] = useState({});
    const [serviciosGenerales, setServiciosGenerales] = useState([]);
    const [nombre, setNombre] = useState('');
    const [tipoCancha, setTipoCancha] = useState('');
    const [precio, setPrecio] = useState('');
    const [estado, setEstado] = useState('Disponible');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    // Cargar cancha y servicios generales
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const response = await ClienteService.getFieldById(id);
                const cancha = response.data;

                setNombre(cancha.nombre);
                setTipoCancha(cancha.tipoCancha);
                setPrecio(cancha.precio);
                setEstado(cancha.estado);

                const user = JSON.parse(localStorage.getItem('user'));
                if (user && user.adminModels && user.adminModels.serviciosGenerales) {
                    const serviciosGenerales = user.adminModels.serviciosGenerales;
                    setServiciosGenerales(serviciosGenerales);

                    const serviciosIniciales = {};
                    cancha.servicios.forEach(servicio => {
                        serviciosIniciales[servicio] = true;
                    });

                    serviciosGenerales.forEach(servicio => {
                        if (!serviciosIniciales[servicio]) {
                            serviciosIniciales[servicio] = false;
                        }
                    });

                    setSeleccionados(serviciosIniciales);
                }
            } catch (error) {
                console.error("Error al cargar la cancha:", error);
                setErrorMsg('No se pudo cargar la información de la cancha.');
            }
        };

        cargarDatos();
    }, [id]);

    // Función para alternar el estado de selección de un servicio
    const toggleSeleccion = (servicio) => {
        setSeleccionados((prevState) => ({
            ...prevState,
            [servicio]: !prevState[servicio],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Obtener el objeto usuario desde el localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user.adminModels) {
            setError("No se pudo obtener la información del usuario.");
            return;
        }

        // Obtener el ID de la empresa
        const empresaId = user.adminModels.id;

        // Recolectar los servicios seleccionados y convertirlos en un array
        const serviciosActualizados = Object.keys(seleccionados).filter(servicio => seleccionados[servicio]);

        // Crear el objeto de cancha actualizado
        const updatedField = {
            id: id,  // Asegúrate de incluir el ID del campo que estás actualizando
            nombre,
            tipoCancha,
            precio: parseFloat(precio),  // Asegúrate de que el precio sea un número
            estado,
            servicios: serviciosActualizados, // Solo los servicios seleccionados
        };

        console.log('Objeto actualizado:', updatedField); // Ver el objeto que se va a enviar

        try {
            // Llamar al servicio para actualizar la cancha, incluyendo el ID de la empresa
            const response = await ClienteService.updateField(id, updatedField, empresaId);

            if (response && response.data) {
                console.log('Respuesta de la API:', response.data); // Ver la respuesta de la API

                const updatedUser = {
                    ...user,
                    adminModels: {
                        ...user.adminModels,
                        fields: user.adminModels.fields.map(field => {
                            // Verifica si el ID del campo actual coincide con el ID de la cancha que quieres actualizar
                            if (field.id === response.data.id) { // Asumiendo que `response` es la respuesta de la API
                                return {
                                    ...field,
                                    // Actualiza los campos necesarios usando la respuesta de la API
                                    nombre: response.data.nombre,
                                    precio: response.data.precio,
                                    estado: response.data.estado,
                                    tipoCancha: response.data.tipoCancha,
                                    servicios: response.data.servicios, // Puedes mantener esto como un array
                                };
                            }
                            // Retorna el campo original si no se actualiza
                            return field;
                        })
                    }
                };

                // Guardar el objeto actualizado en localStorage
                localStorage.setItem('user', JSON.stringify(updatedUser));

                // Redirigir después de la actualización
                navigate('/GestionCanchas');
            } else {
                setError("No se pudo obtener una respuesta válida del servidor.");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error); // Imprimir el error completo
            const mensajeError = error.response && error.response.data ? error.response.data : error.message;
            setError(`Error al actualizar la cancha: ${mensajeError}`);
        }
    };


    return (
        <div className='container_agregarCancha'>
            <Header />
            <main className='main_agregarCancha'>
                <h2 className='tittle_agregarCancha'>Actualizar Cancha</h2>
                <form onSubmit={handleSubmit} className='form'>
                    {errorMsg && <p className="error-message">{errorMsg}</p>}  {/* Mostrar mensaje de error */}

                    <label className='form_label'>
                        <input
                            type='text'
                            placeholder=' '
                            className='form_input_cancha'
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                        <span className='form_text'>Nombre Cancha</span>
                    </label>

                    <div className="cancha-type-container">
                        <p>Tipo de Cancha</p>
                        <div className='container_types'>
                            {/* Radio buttons para tipo de cancha */}
                            {['Fútbol 11', 'Fútbol 8', 'Fútbol 5'].map(tipo => (
                                <label key={tipo} className="radio-option">
                                    <input
                                        type="radio"
                                        name="accountType"
                                        value={tipo}
                                        checked={tipoCancha === tipo}
                                        onChange={() => setTipoCancha(tipo)}
                                        required
                                    />
                                    <span className="custom-radio"></span>
                                    {tipo}
                                </label>
                            ))}
                        </div>
                    </div>

                    <label className='form_label'>
                        <input
                            type='number'
                            placeholder=' '
                            className='form_input_cancha'
                            value={precio}
                            onChange={(e) => setPrecio(e.target.value)}
                            required
                        />
                        <span className='form_text'>Valor por hora</span>
                    </label>

                    <div className="servicios">
                        <p>Servicios</p>
                        <div className="opciones">
                            {serviciosGenerales.length > 0 ? (
                                serviciosGenerales.map(servicio => (
                                    <div
                                        key={servicio}
                                        className={`opcion ${seleccionados[servicio] ? 'seleccionada' : ''}`}
                                        onClick={() => toggleSeleccion(servicio)}
                                    >
                                        {servicio}
                                    </div>
                                ))
                            ) : (
                                <p>No hay servicios disponibles.</p>
                            )}
                        </div>
                    </div>

                    {/* Selector para el estado de la cancha */}
                    <div className="cancha-estado-container">
                        <p>Estado de la Cancha</p>
                        <div className='container_states'>
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    name="estadoCancha"
                                    value="Disponible"
                                    checked={estado === 'Disponible'}
                                    onChange={() => setEstado('Disponible')}
                                    required
                                />
                                <span className="custom-radio"></span>
                                Disponible
                            </label>
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    name="estadoCancha"
                                    value="No Disponible"
                                    checked={estado === 'No Disponible'}
                                    onChange={() => setEstado('No Disponible')}
                                />
                                <span className="custom-radio"></span>
                                No Disponible
                            </label>
                        </div>
                    </div>

                    <button type="submit" className='register'>Actualizar Cancha</button>
                    <NavLink className='return' to='/GestionCanchas'>Volver</NavLink>
                </form>
            </main>
            <footer>
                <NavBar />
            </footer>
        </div>
    );
};

