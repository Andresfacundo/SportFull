import { Routes, Route } from 'react-router-dom' //router
import { Welcome } from './Components/Pages/Welcome/Welcome'
import { Login } from './Components/Pages/Login/Login'
import { Guest } from './Components/Pages/Guest/Guest'
import { SignUp } from './Components/Pages/SignUp/SignUp'
import {HomeClient} from './Components/Pages/Home/HomeClient/HomeClient'
import {HomeEmpresa} from './Components/Pages/Home/HomeEmpresa/HomeEmpresa'
import {HomeGestor} from './Components/Pages/Home/HomeGestor/HomeGestor'
import { ActualizarCliente } from './Components/Pages/ActualizarPerfil/ActualizarCliente/ActualizarCliente'
import { ActualizarEmpresa } from './Components/Pages/ActualizarPerfil/ActualizarEmpresa/ActualizarEmpresa'
import { ActualizarGestor } from './Components/Pages/ActualizarPerfil/ActualizarGestor/ActualizarGestor'
import { BuscarCanchas } from './Components/Pages/BuscarCanchas/BuscarCanchas'
import { HistorialCliente } from './Components/Pages/Historial/HistorialCliente/HistorialCliente'
import {SoporteCliente} from './Components/Pages/Soporte/SoporteCliente/SoporteCliente'

import './App.css'
import Modal from './Components/UI/Modal/Modal'
import ModalExitoso from './Components/UI/ModalExitoso/ModalExitoso'
import ModalFail from './Components/UI/ModalFallido/ModalFallido'
import VistaEmpresas from './Components/Pages/VistaEmpresas/VistaEmpresas'
import Canchas from './Components/UI/Canchas/Canchas'
import VisualizadorCanchas from './Components/UI/VisualizadorCanchas/VisualizadorCanchas'
function App() {
  
  return (     
      
   <Routes >
      <Route path='/' element={<Welcome />} />
      <Route path='/Guest' element={<Guest />} />
      <Route path='/Login' element={<Login />} />
      <Route path='/SignUp' element={<SignUp />} />
      <Route path='/fallido' element={<ModalFail />} />
      <Route path='/canchas' element={<Canchas />} />
      <Route path='/VistaEmpresa' element={<VistaEmpresas empresa="La bombonera" titulo="Bombonera" />} /> 
      <Route path='/VisualizarCanchas' element={<VisualizadorCanchas empresa="Bombonera" />} />

      <Route path='/HomeClient' element={<HomeClient/>} />      
      <Route path='/HomeEmpresa' element={<HomeEmpresa />} />
      <Route path='/HomeGestor' element={<HomeGestor />} />
      <Route path='/ActualizarCliente' element={<ActualizarCliente />} />
      <Route path='/ActualizarEmpresa' element={<ActualizarEmpresa />} />
      <Route path='/ActualizarGestor' element={<ActualizarGestor />} />
      <Route path='/BuscarCanchas' element={<BuscarCanchas />} />
      <Route path='/HistorialCliente' element={<HistorialCliente />} />
      <Route path='/SoporteCliente' element={<SoporteCliente />} />

    </Routes>
  )
}

export default App
