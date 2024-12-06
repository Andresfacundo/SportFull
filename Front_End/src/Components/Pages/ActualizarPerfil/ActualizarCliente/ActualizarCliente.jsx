import React, { useState, useEffect } from 'react';
import './ActualizarCliente.css'
import { Header } from '../../../Layouts/Header/Header';
import { NavLink, useNavigate } from 'react-router-dom';
import fondo_long from '../../../../assets/Images/fondos/fondo_long.png';
import ClienteService from '../../../../services/ClienteService';
import ModalExitoso from '../../../UI/ModalExitoso/ModalExitoso'
import NavBar from '../../../UI/NavBar/NavBar'


export const ActualizarCliente = () => {

  const backgroundStyle = {
    backgroundImage: `url(${fondo_long})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  };

  //main

  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [cc, setCedula] = useState(null);
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
      setCedula(user.clientModels?.cc || ''); // Accede al campo cc dentro de clientModels
      setTelefono(user.clientModels?.telefono || ''); // Accede al campo telefono dentro de clientModels
    }
  }, []);

  const saveUser = (e) => {
    e.preventDefault();

    //obtener datos del usuario
    const user = JSON.parse(localStorage.getItem('user'));  // Obtiene la cadena JSON desde el localStorage
    const client = user.clientModels;
    // Obtén el ID del usuario desde localStorage
    const userId = user.id;

    //obtener imgPerfil para guardar la misma
    const imgPerfil = user.ClientModels?.imgPerfil;

    // Crea un objeto con los datos del usuario a actualizar
    const updatedUser = {
      nombres,
      apellidos,
      clientModels: {
        telefono,
        cc
      }
    };

    // Llama al servicio para actualizar el usuario
    ClienteService.updateClient(userId, updatedUser)
      .then((response) => {
        console.log(response.data);

        // Actualizar el objeto user en localStorage con los datos actualizados
        const newUser = {
          ...user, // Mantiene cualquier dato previo en el objeto 'user' que no se esté actualizando
          nombres,  // Actualizar el campo 'nombres' con los nuevos datos
          apellidos, // Actualizar el campo 'apellidos'    // Actualizar el campo 'email'
          clientModels: {
            ...client,
            telefono,
            cc
          }
        };

        // Guardar el nuevo objeto actualizado en localStorage
        localStorage.setItem('user', JSON.stringify(newUser));

        navigate('/HomeClient'); // Redirige a la página principal después de la actualización
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
        console.log(response.data); // Imprime la respuesta para verificar el contenido
        if (response.data === "Contraseña válida") {
          // Si la contraseña es válida, permitir la edición
          navigate('/AdvancedConfiguration');
          setShowModal(false); // Cerrar el modal
        } else {
          setPasswordError('Contraseña incorrecta');
        }
      })
      .catch((error) => {
        console.error(error);
        setPasswordError('Ocurrió un error al validar la contraseña');
      });


  };

  const handleCloseModal = () => {
    setModalPassword(''); // Limpia la contraseña
    setPasswordError(''); // Limpia el mensaje de error
    setShowPassword(false); // Oculta la contraseña
    setShowModal(false); // Cierra el modal
  };

  return (
    <div style={backgroundStyle} className='container'>
      <Header />

      <main className='main_actualizarClient'>

        <h2 className='tittle_update'>Actualizar Perfil</h2>
        <form onSubmit={saveUser} className='form-update'>
          <label className='form_label'>
            <input
              type='text'
              placeholder=' '
              className='form_input'
              value={nombres || ''}
              onChange={(e) => setNombres(e.target.value)}
              disabled={!isEditable}
            />
            <span className='form_text'>Nombres</span>
          </label>

          <label className='form_label'>
            <input
              type='text'
              placeholder=' '
              className='form_input'
              value={apellidos || ''}
              onChange={(e) => setApellidos(e.target.value)}
              disabled={!isEditable}
            />
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
              value={cc || ''}  // Asignar el estado
              onChange={(e) => setCedula(e.target.value)}  // Actualizar el estado
              disabled={!isEditable}

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
            {isEditable ? 'Guardar' : 'Actualizar'}
          </button>

          <NavLink className='return' to='/HomeClient'>Volver</NavLink>
        </form>


        {/* Modal para ingresar la contraseña */}
        {showModal && (
          <ModalExitoso>
            <h3 className="tittle_modal">Validar contraseña</h3>
            <div className="password_container">
              {passwordError && <p className="error_message">{passwordError}</p>}
              <div className='container-input-validate'>

                <div className="input_password_wrapper">
                  <input
                    className="input_password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    value={modalPassword || ""}
                    onChange={(e) => setModalPassword(e.target.value)}
                  />
                </div>
                <div className="toggle_password_visibility">
                  <label>
                    <input
                      className="checkbox_custom"
                      type="checkbox"
                      checked={showPassword}
                      onChange={() => setShowPassword(!showPassword)}
                    />
                    <span>Mostrar contraseña</span>
                  </label>
                </div>
              </div>
              <div className="container_button">
                <button className="confirm" onClick={validatePasswordAndUpdate}>
                  Confirmar
                </button>
                <button className="cancel" onClick={handleCloseModal}>
                  Cancelar
                </button>
              </div>
            </div>
          </ModalExitoso>
        )}

      </main>

      <footer className='footer_empresa'>
        <NavBar />
      </footer>
    </div>
  )
}