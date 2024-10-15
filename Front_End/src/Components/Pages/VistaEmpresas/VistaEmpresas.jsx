import React, { useState } from 'react'
import './VistaEmpresas.css'
import img from '../../../assets/Images/cancha.jpg'
import imgStar from '../../../assets/Images/ball.png'
const VistaEmpresas = (props) => {
       
    return (

        <div className='Card'>                     

            <div className='content-img'>
                <h3 className='Titulo'>{props.empresa}</h3>
                <img src={img}></img>

            </div>

            <div className='content-links'>
                <div class="bottom-section"> 

                <div className='container-star'>
                    <img src={imgStar} className='imgStar'></img>
                    <span class="title">{props.titulo}  </span>
                    <img src={imgStar} className='imgStar'></img>
                </div>

                    <div class="row row1">
                        <div class="item">
                            <span class="big-text"></span>
                            <a href='#' class="regular-text">Reservar</a>
                            
                        </div>
                        <div class="item">
                            <span class="big-text"></span>
                            <a href='#' class="regular-text">Ubicacion</a>
                           
                        </div>
                        <div class="item">
                            <span class="big-text"></span>
                            <a href='#' class="regular-text">Canchas</a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default VistaEmpresas
