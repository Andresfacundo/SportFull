import React, { useState, useEffect } from 'react';
import './EditManager.css'
import { useParams } from 'react-router-dom';
import { Header } from '../../../../Layouts/Header/Header';
import { NavLink, useNavigate } from 'react-router-dom';
import ClienteService from '../../../../../services/ClienteService';


const EditManager = () => {
  const { id } = useParams();

  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmacionContraseña, setConfirmacionContraseña] = useState('');
  const [ccgestor, setCcgestor] = useState('');
  const [telefono, setTelefono] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  // Cargar gestor
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const response = await ClienteService.getManagerById(id);
        const manager = response.data;

        setNombres(manager.userModels?.nombres);
        setApellidos(manager.userModels?.apellidos);
        setEmail(manager.userModels?.email);
        setCcgestor(manager.ccgestor);
        setTelefono(manager.telefono);



      } catch (error) {
        console.error("Error al cargar la cancha:", error);
        setError('No se pudo cargar la información de la cancha.');
      }
    };

    cargarDatos();
  }, [id]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Obtener el objeto usuario desde el localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.adminModels) {
      setError("No se pudo obtener la información del usuario.");
      return;
    }



    // Crear el objeto de cancha actualizado
    const updatedManager = {
      id: id,  // Asegúrate de incluir el ID del campo que estás actualizando
      nombres,
      apellidos,
      email,
      contraseña,
      gestorModels: {
        ccgestor,
        telefono
      }
    };

    console.log('Objeto actualizado:', updatedManager); // Ver el objeto que se va a enviar


    // Llamar al servicio para actualizar el gestor, incluyendo el ID de la empresa
    ClienteService.updatedManager(id, updatedManager)
      .then((response) => {
        console.log('Gestor Actualizado:', response.data);

        // Obtener el usuario almacenado en el localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));

        if (storedUser && storedUser.adminModels) {
          // Buscar el gestor en la lista de gestores usando el ID del gestor
          const updatedGestores = storedUser.adminModels.gestores.map(gestor =>
            gestor.id === id ? { ...gestor, ...response.data } : gestor
          );

          // Actualizar el gestor en la lista de gestores
          storedUser.adminModels.gestores = updatedGestores;

          // Actualizar el localStorage con los datos modificados
          localStorage.setItem('user', JSON.stringify(storedUser));

          console.log('LocalStorage actualizado:', storedUser);
        } else {
          console.error('No se encontró el usuario o adminModels en el localStorage.');
        }

        // Redirigir después de la actualización
        navigate('/GestionEmpleados');

      })
      .catch((error) => {
        console.error("Error al actualizar el gestor:", error); // Imprimir el error completo
        const mensajeError = error.response && error.response.data ? error.response.data : error.message;
        setError(`Error al actualizar la cancha: ${mensajeError}`);
      });

  };

  return (
    <div className='container_agregarEmpleado'>
      <Header />

      <main className='main_agregarEmpleado'>
        <h1 className='title_register'>Actualizar Gestor</h1>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className='form'>
          <label className='form_label'>
            <input
              type='text'
              placeholder=' '
              className='form_input'
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              required
            />
            <span className='form_text'>Nombres</span>
          </label>

          <label className='form_label'>
            <input
              type='text'
              placeholder=' '
              className='form_input'
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              required
            />
            <span className='form_text'>Apellidos</span>
          </label>

          <label className='form_label'>
            <input
              type='email'
              placeholder=' '
              className='form_input'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <span className='form_text'>Correo</span>
          </label>

          <label className='form_label'>
            <input
              type='number'
              placeholder=' '
              className='form_input'
              value={ccgestor}
              onChange={(e) => setCcgestor(e.target.value)}
              required
            />
            <span className='form_text'>Cedula</span>
          </label>

          <label className='form_label'>
            <input
              type='number'
              placeholder=' '
              className='form_input'
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
            <span className='form_text'>Telefono</span>
          </label>

          <label className='form_label'>
            <div className='password-input-container'>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder=' '
                className='form_input'
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}

              />
              <span className='form_text'>Contraseña</span>
              {contraseña && (
                <span
                  className='password-toggle-icon'
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: 'pointer', position: 'absolute', fontSize: '18px', right: '18px', top: '32%', transform: 'translateY(-50%)' }}
                >
                  <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                </span>
              )}
            </div>
          </label>

          <label className='form_label'>
            <div className='password-input-container'>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder=' '
                className='form_input'
                value={confirmacionContraseña}
                onChange={(e) => setConfirmacionContraseña(e.target.value)}

              />
              <span className='form_text'>Confirmar Contraseña</span>
              {confirmacionContraseña && (
                <span
                  className="password-toggle-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ cursor: 'pointer', position: 'absolute', fontSize: '18px', right: '18px', top: '32%', transform: 'translateY(-50%)' }}
                >
                  <i className={showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                </span>
              )}
            </div>
          </label>

          <button type="submit" className='register'>Actualizar Gestor</button>
          <NavLink className='return' to='/GestionEmpleados'>Volver</NavLink>
        </form>

        {showModal && (
          <ModalExitoso>
            <h3 className='tittle_modal'>Gracias por registrarse</h3>
            <p className='message'>
              Para completar su registro, por favor verifique su dirección de
              correo electrónico haciendo clic en el enlace que hemos enviado a:
            </p>
            <p><strong>{email}</strong></p>
            <button className='cancel' onClick={handleCloseModal}>Cerrar</button>
          </ModalExitoso>
        )}
      </main>
    </div>
  );
}

export default EditManager
