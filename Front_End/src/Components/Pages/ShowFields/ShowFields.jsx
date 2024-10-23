import React from 'react'
import './ShowFields.css'
import NavBar from '../../UI/NavBar/NavBar';
import { Header } from '../../Layouts/Header/Header';
import fondo_long from '../../../assets/Images/fondos/fondo_long.png';
import { SmallCard } from '../../UI/SmallCard/SmallCard';
import ClienteService from '../../../services/ClienteService'; // Importar el servicio




export const ShowFields = () => {
    const backgroundStyle = {
        backgroundImage: `url(${fondo_long})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100%',
        width: '100%',
    };

    return (
        <div style={backgroundStyle} className='container'>
            <Header />

            

        </div>
    )
}
