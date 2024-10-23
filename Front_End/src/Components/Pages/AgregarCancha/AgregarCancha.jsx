import React, { useState, useEffect } from 'react';
import './AgregarCancha.css';
import { Header } from '../../../Components/Layouts/Header/Header';
import { NavLink, useNavigate } from 'react-router-dom'; 
import NavBar from '../../UI/NavBar/NavBar';
import ClienteService from '../../../services/ClienteService';  // Importar ClienteService para la petición

export const AgregarCancha = () => {
    const [seleccionados, setSeleccionados] = useState({});
    const [servicios, setServicios] = useState([]);
    const [nombre, setNombre] = useState('');
    const [tipoCancha, setTipoCancha] = useState('');
    const [precio, setPrecio] = useState('');
    const [estado, setEstado] = useState('Disponible'); // Estado de la cancha (inicialmente "Disponible")
    const [errorMsg, setErrorMsg] = useState(''); // Para manejar los errores
    const navigate = useNavigate(); // Inicializar el hook useNavigate

    // Función para cargar los servicios generales desde localStorage
    useEffect(() => {
        const cargarServicios = () => {
            const user = JSON.parse(localStorage.getItem('user')); // Obtener el objeto user del localStorage
            if (user && user.adminModels && user.adminModels.serviciosGenerales) {
                const serviciosGenerales = user.adminModels.serviciosGenerales;
                // Inicializa los servicios como no seleccionados
                const serviciosIniciales = serviciosGenerales.reduce((acc, servicio) => {
                    acc[servicio] = false;
                    return acc;
                }, {});
                setServicios(serviciosGenerales);
                setSeleccionados(serviciosIniciales);
            }
        };

        cargarServicios();
    }, []);

    // Función para alternar el estado de selección de un servicio
    const toggleSeleccion = (servicio) => {
        setSeleccionados((prevState) => ({
            ...prevState,
            [servicio]: !prevState[servicio],
        }));
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const user = JSON.parse(localStorage.getItem('user')); // Obtener el usuario desde el localStorage
        if (!user) {
            setErrorMsg("No se pudo obtener la información del usuario.");
            return;
        }
        
        const empresaId = user.id; // ID de la empresa
    
        // Obtener los servicios seleccionados
        const selectedServices = Object.keys(seleccionados).filter((servicio) => seleccionados[servicio]);
    
        // Validar campos obligatorios
        if (!nombre || !tipoCancha || !precio || selectedServices.length === 0) {
            setErrorMsg('Por favor, completa todos los campos y selecciona al menos un servicio.');
            return;
        }
    
        // Crear el objeto de la cancha
        const cancha = {
            nombre: nombre,
            tipoCancha: tipoCancha,
            precio: parseFloat(precio),  // Asegurarse de que el precio sea numérico
            estado: estado,
            servicios: selectedServices
        };
    
        // Llamar a la API para crear la cancha
        try {
            const response = await ClienteService.createField(cancha, empresaId);
            console.log('Cancha creada exitosamente:', response.data);
    
            // Actualizar localStorage con los nuevos datos
            const updatedUser = {
                ...user,
                adminModels: {
                    ...user.adminModels,
                    fields: [...user.adminModels.fields, response.data] // Agregar la nueva cancha al array de canchas
                }
            };
            
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Guardar el nuevo usuario en localStorage
    
            navigate('/GestionCanchas'); // Redirigir a la página de gestión de canchas
            setErrorMsg('');  // Limpiar el mensaje de error
        } catch (error) {
            const mensajeError = error.response && error.response.data ? error.response.data : error.message;
            setErrorMsg(`Error al crear la cancha: ${mensajeError}`);
        }
    };
    

    return (
        <div className='container_agregarCancha'>
            <Header />

            <main className='main_agregarCancha'>
                <h2 className='tittle_agregarCancha'>Agregar Cancha</h2>
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
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    name="accountType"
                                    value="Fútbol 11"
                                    onChange={(e) => setTipoCancha(e.target.value)}
                                    required
                                />
                                <span className="custom-radio"></span>
                                Fútbol 11
                            </label>
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    name="accountType"
                                    value="Fútbol 8"
                                    onChange={(e) => setTipoCancha(e.target.value)}
                                />
                                <span className="custom-radio"></span>
                                Fútbol 8
                            </label>
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    name="accountType"
                                    value="Fútbol 5"
                                    onChange={(e) => setTipoCancha(e.target.value)}
                                />
                                <span className="custom-radio"></span>
                                Fútbol 5
                            </label>
                        </div>
                    </div>

                    {/* Mostrar los servicios generales dinámicamente */}
                    <div className="servicios">
                        <p>Servicios</p>
                        <div className="opciones">
                            {servicios.length > 0 ? (
                                servicios.map((servicio) => (
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
                                    onChange={(e) => setEstado(e.target.value)}
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
                                    onChange={(e) => setEstado(e.target.value)}
                                />
                                <span className="custom-radio"></span>
                                No Disponible
                            </label>
                        </div>
                    </div>

                    <button type="submit" className='register'>Agregar Cancha</button>
                    <NavLink className='return' to='/GestionCanchas'>Volver</NavLink>
                </form>
            </main>
            <footer>
                <NavBar />
            </footer>
        </div>
    );
};
