import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ClienteService from '../../../../services/ClienteService';
import './AgregarEmpleado.css';
import { Header } from '../../../Layouts/Header/Header';
import ModalExitoso from '../../../UI/ModalExitoso/ModalExitoso';


export const AgregarEmpleado = () => {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmacionContraseña, setConfirmacionContraseña] = useState('');
  const [ccgestor, setCcgestor] = useState('');
  const [telefono, setTelefono] = useState('');
  const [empresaId, setEmpresaId] = useState(null); // Estado para almacenar el id de la empresa

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el usuario autenticado desde el localStorage y establecer el id de la empresa
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.adminModels) {
      setEmpresaId(storedUser.adminModels.id);
    } else {
      console.error('No se encontró el ID de la empresa en localStorage.');
    }
  }, []);

  const saveUser = (e) => {
    e.preventDefault();
  
    // Validación básica
    if (!nombres || !apellidos || !email || !contraseña || !confirmacionContraseña || !ccgestor || !telefono || !empresaId) {
      setError('Todos los campos son obligatorios');
      return;
    }
  
    // Validar que las contraseñas coincidan
    if (contraseña !== confirmacionContraseña) {
      setError('Las contraseñas no coinciden');
      return;
    }
  
    // Crear el objeto `user` en el formato adecuado
    const user = {
      nombres,
      apellidos,
      email,
      contraseña,
      gestorModels: {
        telefono,
        ccgestor,
      },
    };
  
    ClienteService.createGestor(user, empresaId)
      .then((response) => {
        console.log('Gestor creado:', response.data);
  
        // Obtener el usuario almacenado en el localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
  
        if (storedUser && storedUser.adminModels) {
          // Agregar el nuevo gestor a la lista de gestores
          storedUser.adminModels.gestores = [...storedUser.adminModels.gestores, response.data];
  
          // Actualizar el localStorage con los datos modificados
          localStorage.setItem('user', JSON.stringify(storedUser));
  
          console.log('LocalStorage actualizado:', storedUser);
        } else {
          console.error('No se encontró el usuario o adminModels en el localStorage.');
        }
  
        // Mostrar el modal de éxito
        setShowModal(true);
      })
      .catch((error) => {
        console.error('Error al registrar el gestor:', error);
        setError('Ocurrió un error al registrar el usuario. Inténtalo de nuevo.');
      });
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/GestionEmpleados');
  };

  return (
    <div className='container_agregarEmpleado'>
      <Header />

      <main className='main_agregarEmpleado'>
        <h1 className='title_register'>Registrar Gestor</h1>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={saveUser} className='form'>
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
                required
              />
              <span className='form_text'>Contraseña</span>
              {contraseña && (
                <span 
                  className='password-toggle-icon' 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: 'pointer', position: 'absolute', fontSize: '18px', right:'18px', top: '32%', transform: 'translateY(-50%)' }}
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
                required
              />
              <span className='form_text'>Confirmar Contraseña</span>
              {confirmacionContraseña && (
                <span 
                  className="password-toggle-icon" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ cursor: 'pointer', position: 'absolute', fontSize: '18px', right:'18px', top: '32%', transform: 'translateY(-50%)' }}
                >
                  <i className={showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                </span>
              )}
            </div>
          </label>

          <button type="submit" className='register'>Registrar Gestor</button>
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
