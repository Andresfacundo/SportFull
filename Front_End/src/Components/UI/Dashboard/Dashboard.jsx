import React from 'react'
import './Dashboard.css'
import { NavLink } from 'react-router-dom'
import calendarioDash from '../../../assets/Images/icons/calendar.png'
import money from '../../../assets/Images/icons/dollar-symbol.png'
import list from '../../../assets/Images/icons/list.png'

const Dashboard = () => {
  return (
    <div className='contenedor-dashboard'>

      <h2 className='titulo-dashboard'>Dashboard Administrativo</h2>
        
   <NavLink className="dashboard-a"> 
          <div className='seccion-1'>
                  <h3>Reservas hoy </h3>
                  <img src={calendarioDash} className='calendarioDash'/>
          </div> 
          <div className='seccion-2'>
            <p>12</p>
          </div>
   </NavLink>

   <NavLink className="dashboard-a"> 
          <div className='seccion-1'>
                  <h3>Ingresos diarios </h3>
                  <img src={money} className='calendarioDash'/>                  
          </div> 
          <div className='seccion-2'>
            <p>1500</p>
          </div>
   </NavLink>

   <NavLink className="dashboard-a"> 
          <div className='seccion-1'>
                  <h3>Canchas Activas </h3>
                  <img src={list} className='calendarioDash'/> 
          </div> 
          <div className='seccion-2'>
            <p>5</p>
          </div>
   </NavLink>
        
      
    </div>
  )
}

export default Dashboard
