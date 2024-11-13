import { Routes, Route } from 'react-router-dom' //router
import { Welcome } from './Components/Pages/Welcome/Welcome'
import { Login } from './Components/Pages/Login/Login'
import { Guest } from './Components/Pages/Guest/Guest'
import { SignUp } from './Components/Pages/SignUp/SignUp'


import GPS from "./Components/UI/GPS/GPS.jsx";


import {HomeClient} from './Components/Pages/Home/HomeClient/HomeClient'
import {HomeEmpresa} from './Components/Pages/Home/HomeEmpresa/HomeEmpresa'
import {HomeGestor} from './Components/Pages/Home/HomeGestor/HomeGestor'
import { ActualizarCliente } from './Components/Pages/ActualizarPerfil/ActualizarCliente/ActualizarCliente'
import { ActualizarEmpresa } from './Components/Pages/ActualizarPerfil/ActualizarEmpresa/ActualizarEmpresa'
import { ActualizarGestor } from './Components/Pages/ActualizarPerfil/ActualizarGestor/ActualizarGestor'
import { BuscarCanchas } from './Components/Pages/BuscarCanchas/BuscarCanchas'
import { HistorialCliente } from './Components/Pages/Historial/HistorialCliente/HistorialCliente'
import {SoporteCliente} from './Components/Pages/Soporte/SoporteCliente/SoporteCliente'
import { AdvancedConfiguration } from './Components/Pages/AdvancedConfiguration/AdvancedConfiguration'
import { ChangePassword } from './Components/Pages/ChangePassword/ChangePassword'
import { PaymentMethod } from './Components/Pages/PaymentMethod/PaymentMethod'
import {VerifyEmail} from './Components/Pages/VerifyEmail/VerifyEmail'
import Services from './Components/UI/FieldServices/FieldServices'
import {GestionReservas} from './Components/Pages/GestionReservas/GestionReservas'
import {StatusAccount} from './Components/Pages/StatusAccount/StatusAccount'
import {AgregarCancha} from './Components/Pages/AgregarCancha/AgregarCancha'
import {GestionCanchas} from './Components/Pages/GestionCanchas/GestionCanchas'
import { GestionEmpleados } from './Components/Pages/GestionEmpleados/MenuGestionEmpleados/GestionEmpleados.jsx'
import { GestionReportes } from './Components/Pages/GestionReportes/GestionReportes.jsx'
import { SmallCard } from './Components/UI/SmallCard/SmallCard.jsx'
import { DeleteFields } from './Components/Pages/DeleteFields/DeleteFields.jsx'
import { ShowFields } from './Components/Pages/ShowFields/ShowFields.jsx'
import { SelectUpdateField } from './Components/Pages/SelectUpdateField/SelectUpdateField.jsx'
import { UpdateField } from './Components/Pages/UpdateField/UpdateField.jsx'
import { AgregarEmpleado } from './Components/Pages/GestionEmpleados/AgregarEmpleado/AgregarEmpleado.jsx'
import { ActualizarEmpleado } from './Components/Pages/GestionEmpleados/ActualizarEmpleado/ActualizarEmpleado.jsx'
import { ConsultarEmpleados } from './Components/Pages/GestionEmpleados/ConsultarEmpleados/ConsultarEmpleados.jsx'
import { EliminarEmpleado } from './Components/Pages/GestionEmpleados/EliminarEmpleado/EliminarEmpleado.jsx'
import EditManager from './Components/Pages/GestionEmpleados/ActualizarEmpleado/EditManager/EditManager.jsx'
import EditProfile from './Components/Pages/EditProfile/EditProfile.jsx'

import './App.css'

function App() {
  
  return (

    <Routes >
      <Route path='/' element={<Welcome />} />
      <Route path='/Guest' element={<Guest />} />
      <Route path='/Login' element={<Login />} />
      <Route path='/SignUp' element={<SignUp />} />
      <Route path='/GPS' element={<GPS />} />
      <Route path='/HomeClient' element={<HomeClient/>} />      
      <Route path='/HomeEmpresa' element={<HomeEmpresa />} />
      <Route path='/HomeGestor' element={<HomeGestor />} />
      <Route path='/ActualizarCliente' element={<ActualizarCliente />} />
      <Route path='/ActualizarEmpresa' element={<ActualizarEmpresa />} />
      <Route path='/ActualizarGestor' element={<ActualizarGestor />} />
      <Route path='/BuscarCanchas' element={<BuscarCanchas />} />
      <Route path='/HistorialCliente' element={<HistorialCliente />} />
      <Route path='/SoporteCliente' element={<SoporteCliente />} />
      <Route path='/AdvancedConfiguration' element={<AdvancedConfiguration />} />
      <Route path='/ChangePassword' element={<ChangePassword />} />
      <Route path='/PaymentMethod' element={<PaymentMethod />} />
      <Route path='/FieldServices' element={<Services />} />
      <Route path='/auth/verify' element={<VerifyEmail />} />
      <Route path='/GestionReservas' element={<GestionReservas />} />
      <Route path='/StatusAccount' element={<StatusAccount />} />
      <Route path='/GestionCanchas' element={<GestionCanchas />} />
      <Route path='/AgregarCancha' element={<AgregarCancha />} />
      <Route path='/DeleteFields' element={<DeleteFields />} />
      <Route path='/GestionReportes' element={<GestionReportes />} />
      <Route path='/GestionEmpleados' element={<GestionEmpleados />} />
      <Route path='/UpdateField/:id' element={<UpdateField />} />
      <Route path='/ShowFields' element={<ShowFields />} />
      <Route path='/SelectUpdateField' element={<SelectUpdateField />} />
      <Route path="/editprofile" element={<EditProfile />} />
      <Route path="/AddEmployee" element={<AgregarEmpleado />} />
      <Route path="/DeleteEmployee" element={<EliminarEmpleado />} />
      <Route path="/UpdateEmployee" element={<ActualizarEmpleado />} />
      <Route path="/ShowEmployee" element={<ConsultarEmpleados />} />
      <Route path="/EditManager/:id" element={<EditManager />} />


    </Routes>
  )
}

export default App
