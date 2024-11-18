import React from 'react'
import './CardGps.css'
import MapaConGPS from '../GPS/GPS'

const CardGps = () => {
  return (
    <div className='cardGps'>
      <section className='mapaGps'>
               
      </section>
    
      <section className='precio'>

        <h3>Precio</h3>
        <div className='precio-contenedor'>
            <input type='number' placeholder='min'/>
            <p> - </p>
            <input type='number'placeholder='max'/>
        </div>

      </section>

      <section className='ubicacion'>
                <h3>Ubicación</h3>
                <input type='text'placeholder='Dirección'/>        
        </section>

        <section className='disponibilidad'>
                <h3>Disponibilidad</h3>

            <div className='a-disponibilidad'>
                <p>Hora</p>
                <input type='text'/>
            </div>

            <div className='b-disponibilidad'>
                <div>
                    <p>Dia</p>
                    <input type='number'/>
                </div>
                <div>
                      <p>Mes</p>
                      <input type='number'/>
                </div>
                <div>
                      <p>Año</p>
                      <input type='number'/>
                </div>
            </div>
        
        </section>

        <section className='tipoCancha'>
          <h3>Tipo de cancha</h3>
          <div className='contenedorTipoCancha'> 
            <div>
                <p>Futbol 5</p>
                <input type='radio'/>
            </div>
            <div>
                 <p>Futbol 8</p>
                 <input type='radio'/>
            </div>
            <div>
                <p>Futbol 11</p>
                <input type='radio'/>
            </div>
          </div>
        
        </section>
        
        <section className='servicios'>
                <h3>Servicios</h3>

                 <div className='servicios-contenedor'>         

                <input type='checked' placeholder='Arbitraje'/>
                <input type='checked' placeholder='Petos'/> 
                <input type='checked' placeholder='Iluminacion'/> 
                <input type='checked' placeholder='Balon'/> 
                <input type='checked' placeholder='Hidratacion'/> 
                <input type='checked' placeholder='Cronometro'/> 
                <input type='checked' placeholder='Vestuarios'/>    
                <input type='checked' placeholder='Duchas'/>  
                <input type='checked' placeholder='Baños'/>   

                </div>  
        </section>

        <button>Buscar</button>

    </div>
  )
}

export default CardGps
