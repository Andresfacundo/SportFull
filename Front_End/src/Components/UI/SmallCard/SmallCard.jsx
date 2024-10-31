import React, { Children } from 'react'
import './SmallCard.css'
import img from '../../../assets/Images/cancha.jpg'
import imgStar from '../../../assets/Images/ball.png'


export const SmallCard = ({ nombreCancha, nombreEmpresa, children }) => {
    return (

        <div className='Card'>

            <div className='content-img'>
                <h3 className='Titulo'>{nombreEmpresa}</h3>
                <img src={img} className='img_cancha'></img>

            </div>

            <div className='content-links'>
                <div className="bottom-section">

                    <div className='container-star'>
                        <img src={imgStar} className='imgStar'></img>
                        <span className="title">{nombreCancha}  </span>
                        <img src={imgStar} className='imgStar'></img>
                    </div>

                    <div className="row row1">
                        {children}
                        {/* <div className="item">
                            <span className="big-text"></span>
                            <a href='#' className="regular-text">{tipoCancha} </a>

                        </div>
                        <div className="item">
                            <span className="big-text"></span>
                            <a href='#' className="regular-text">{precio} </a>

                        </div>
                        <div className="item">
                            <span className="big-text"></span>
                            <a href='#' className="regular-text">Eliminar</a>
                        </div> */}
                    </div>
                </div>
            </div>

        </div>
    )
}
