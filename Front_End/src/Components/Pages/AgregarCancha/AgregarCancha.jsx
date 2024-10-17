import React, { useState } from 'react';
import './AgregarCancha.css'
import { Header } from '../../../Components/Layouts/Header/Header';
import { NavLink, useNavigate } from 'react-router-dom';


export const AgregarCancha = () => {

    const [seleccionados, setSeleccionados] = useState({
        Petos: true,
        Iluminación: false,
        Balón: true,
        Hidratación: true,
        Cronómetro: true,
        Vestuarios: true,
        Duchas: false,
        Baños: true,
    });

    const toggleSeleccion = (servicio) => {
        setSeleccionados((prevState) => ({
            ...prevState,
            [servicio]: !prevState[servicio],
        }));
    };

    return (
        <div className='container_agregarCancha'>
            <Header />

            <main className='main_agregarCancha'>
                <h2 className='tittle_agregarCancha'>Agregar Cancha</h2>
                <form onSubmit='{saveCancha}' className='form'>
                    <label className='form_label'>
                        <input
                            type='text'
                            placeholder=' '
                            className='form_input_cancha'
                        // value={nombres || ''}
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
                                    // value="futbol_11"
                                    // checked={tipoUsuario === 'CLIENTE'}
                                    // onChange={(e) => setTipoUsuario(e.target.value)}
                                    required
                                />
                                <span className="custom-radio"></span>
                                Futbol 11
                            </label>
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    name="accountType"
                                    value="futbol_8"
                                // checked={tipoUsuario === 'EMPRESA'}
                                // onChange={(e) => setTipoUsuario(e.target.value)}
                                // required
                                />
                                <span className="custom-radio"></span>
                                Futbol 8
                            </label>
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    name="accountType"
                                    value="futbol_5"
                                // checked={tipoUsuario === 'EMPRESA'}
                                // onChange={(e) => setTipoUsuario(e.target.value)}
                                // required
                                />
                                <span className="custom-radio"></span>
                                Futbol 5
                            </label>
                        </div>

                    </div>

                    <div className="servicios">
                        <p>Servicios</p>
                        <div className="opciones">
                            {Object.keys(seleccionados).map((servicio) => (
                                <div
                                    key={servicio}
                                    className={`opcion ${seleccionados[servicio] ? 'seleccionada' : ''}`}
                                    onClick={() => toggleSeleccion(servicio)}
                                >
                                    {servicio}
                                </div>
                            ))}
                        </div>
                    </div>

                    <label className='form_label'>
                        <input
                            type='text'
                            placeholder=' '
                            className='form_input_cancha'
                        // value={nombres || ''}
                        />
                        <span className='form_text'>Valor por hora</span>
                    </label>

                <button type="submit" className='register'>Agregar Cancha</button>
                <NavLink className='return' to='/GestionCanchas'>Volver</NavLink>
                </form>

            </main>



        </div>
    )
}
