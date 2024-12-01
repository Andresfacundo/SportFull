import React, { useState, useEffect } from 'react';
import './ActualizarGestor.css'
import { Header } from '../../../Layouts/Header/Header';
import { NavLink, useNavigate } from 'react-router-dom';
import fondo_long from '../../../../assets/Images/fondos/fondo_long.png';
import ClienteService from '../../../../services/ClienteService';
import ModalExitoso from '../../../UI/ModalExitoso/ModalExitoso'
import NavBar from '../../../UI/NavBar/NavBar'


export const ActualizarGestor = () => {

  const backgroundStyle = {
    backgroundImage: `url(${fondo_long})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100%',
    width: '100%',
  };

  //main

  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [ccgestor, setCcgestor] = useState(null);
  const [telefono, setTelefono] = useState(null);
  const [error, setError] = useState('');
  const [isEditable, setIsEditable] = useState(false);


  const navigate = useNavigate();
  // useEffect para cargar los datos del usuario al montar el componente
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); // Obtiene el usuario almacenado en localStorage


    if (user) {
      // Cargar los datos del usuario en los estados
      setNombres(user.nombres || '');
      setApellidos(user.apellidos || '');
      setEmail(user.email || '');
      setCcgestor(user.gestorModels?.ccgestor || ''); // Accede al campo cc dentro de clientModels
      setTelefono(user.gestorModels?.telefono || ''); // Accede al campo telefono dentro de clientModels
    }
  }, []);

  const saveUser = (e) => {
    e.preventDefault();

    //obtener datos del usuario
    const user = JSON.parse(localStorage.getItem('user'));  // Obtiene la cadena JSON desde el localStorage

    // Obtén el ID del usuario desde localStorage
    const userId = user.id;

    // Crea un objeto con los datos del usuario a actualizar
    const updatedUser = {

      gestorModels: {
        ...ccgestor,

        telefono
      }
    };

    // Llama al servicio para actualizar el usuario
    ClienteService.updateGestor(userId, updatedUser)
      .then((response) => {
        console.log(response.data);

        // Actualizar el objeto user en localStorage con los datos actualizados
        const newUser = {
          ...user,

          gestorModels: {
            ...user.gestorModels,
            telefono
          }

        };

        // Guardar el nuevo objeto actualizado en localStorage
        localStorage.setItem('user', JSON.stringify(newUser));

        navigate('/HomeGestor'); // Redirige a la página principal después de la actualización
      })
      .catch((error) => {
        console.log(error);
        setError("Ocurrió un error al actualizar el usuario. Inténtalo de nuevo.");
      });
  };
  // Función para validar la contraseña

  const [modalPassword, setModalPassword] = useState(''); // Contraseña ingresada en el modal
  const [passwordError, setPasswordError] = useState(''); // Mensaje de error del modal
  const [showModal, setShowModal] = useState(false); // Controla la visibilidad del modal
  const [showPassword, setShowPassword] = useState(false); // Para controlar la visibilidad de la contraseña

  const user = JSON.parse(localStorage.getItem('user')); // Obtener el usuario del localStorage
  const userId = user.id; // Obtener el ID del usuario

  // Función para abrir el modal
  const handleUpdateClick = (e) => {
    e.preventDefault();
    setShowModal(true);

  };

  const requestBody = {
    contraseña: modalPassword
  };

  // Función para validar la contraseña y proceder con la actualización
  const validatePasswordAndUpdate = () => {

    // Prepara los datos para enviarlos al backend
    ClienteService.validatePassword(userId, requestBody)
      .then((response) => {
        console.log("Respuesta de la API:", response.data);
        if (response.data === "Contraseña válida") {
          navigate('/AdvancedConfiguration');
          setShowModal(false);
        } else {
          console.log("Contraseña incorrecta detectada");
          setPasswordError('Contraseña incorrecta');
        }
      })
      .catch((error) => {
        console.error("Error al validar la contraseña:", error);
        setPasswordError('Ocurrió un error al validar la contraseña');
      });

  };
  return (
    <div style={backgroundStyle} className='container'>
      <Header />

      <main className='main-perfilGestor'>

        <h2 className='tittle_update'>Actualizar Perfil</h2>
        <form onSubmit={saveUser} className='form-update'>
          <label className='form_label'>
            <input
              type='text'
              placeholder=' '
              className='form_input'
              value={nombres || ''}
              disabled={true} />
            <span className='form_text'>Nombres</span>
          </label>

          <label className='form_label'>
            <input
              type='text'
              placeholder=' '
              className='form_input'
              value={apellidos || ''}
              disabled={true} />
            <span className='form_text'>Apellidos</span>
          </label>
          <label className='form_label'>
            <input
              type='email'
              placeholder=' '
              className='form_input'
              value={email || ''}
              disabled={true}
            />
            <span className='form_text'>Correo</span>
          </label>

          <h2 className='tittle_optional_data'>Datos Opcionales</h2>
          <label className='form_label'>
            <input
              type='number'
              placeholder=' '
              className='form_input'
              value={ccgestor || ''}  // Asignar el estado
              disabled={true}
            />
            <span className='form_text'>Cedula</span>
          </label>
          <label className='form_label'>
            <input
              type='number'
              placeholder=' '
              className='form_input'
              value={telefono || ''}  // Asignar el estado
              onChange={(e) => setTelefono(e.target.value)}  // Actualizar el estado
              disabled={!isEditable}

            />
            <span className='form_text'>Telefono</span>
          </label>

          <NavLink
            className={'changePassword'}
            to='/AdvancedConfiguration'
            onClick={handleUpdateClick} // Muestra el modal para validar la contraseña
          >Configuración Avanzada</NavLink>

          <button
            className='register'
            onClick={(e) => {
              e.preventDefault(); // Evita el envío del formulario de inmediato
              if (!isEditable) {
                setIsEditable(true); // Habilita los inputs
              } else {
                saveUser(e); // Llama a la función de guardado si ya están habilitados
              }
            }}
          >
            {isEditable ? 'Guardar Cambios' : 'Actualizar Perfil'}
          </button>

          <NavLink className='return' to='/HomeGestor'>Volver</NavLink>
        </form>


        {/* Modal para ingresar la contraseña */}
        {showModal && (
          <ModalExitoso>
            <h3 className='tittle_modal'>Validar contraseña</h3>
            <div className='password_container'>
              {passwordError && <p className='error_message'>{passwordError}</p>}
              <input
                className={`input_password ${passwordError ? 'input_error' : ''}`}
                type={showPassword ? 'text' : 'password'}
                placeholder='Ingresa tu contraseña'
                value={modalPassword || ''}
                onChange={(e) => setModalPassword(e.target.value)}
              />
              <div className='container_button'>
                <button className='confirm' onClick={validatePasswordAndUpdate}>Confirmar</button>
                <button className='cancel' onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
              {modalPassword && (
                <span
                  className='password-toggle-icon'
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                </span>
              )}
            </div>
          </ModalExitoso>
        )}

      </main>

      <footer>
        <NavBar/>
      </footer>
    </div>
  )
}