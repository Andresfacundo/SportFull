import React from 'react'
import img from '../../../assets/Images/cancha.jpg'
import './VisualizadorCanchas.css'
import Calendario from '../Calendario/Calendario'

const VisualizadorCanchas = (props) => {
    return (
        
            <div className='canchas'>

                <div className='content-img-canchas'>
                    <h3 className='visualizadorTitulo'>{props.empresa}</h3>
                    <img src={img} className='img-canchas'></img>
                </div>

                <h2 className='titulo-cancha'>La bombonera</h2>

                <section className='descripcion'>
                     <h3>Tipo de cancha:</h3><br></br>
                     <p>Futbol 8</p>
                </section>
                <section className='precio'>
                    <h3>Precio:</h3>
                    <p>$50.000</p>
                </section>


                <section className='servicios'>
                     <h3>Servicios:</h3>
                     <div className='servicios-btns'>
                          <button> Petos </button>
                          <button> Agua </button>
                          <button> Arbitraje </button>
                          <button> medallas </button>
                          <button> iluminacion </button>                          
                     </div>                     
                </section>

                <Calendario/> 

                <section className='btn'>
                    <button className='btn-reservar'>Reservar</button>
                </section>                

            </div>        
    )
}

export default VisualizadorCanchas
