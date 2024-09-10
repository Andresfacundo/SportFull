import { Routes, Route } from 'react-router-dom' //router
import { Welcome } from './Components/Pages/Welcome/Welcome'
import { Login } from './Components/Pages/Login/Login'
import { Guest } from './Components/Pages/Guest/Guest'
import { SignUp } from './Components/Pages/SignUp/SignUp'
import { Home } from './Components/Pages/Home/Home'
import GPS from "./Components/UI/GPS/GPS.jsx";


import './App.css'

function App() {

  return (

    <Routes >
      <Route path='/' element={<Welcome />} />
      <Route path='/Guest' element={<Guest />} />
      <Route path='/Login' element={<Login />} />
      <Route path='/SignUp' element={<SignUp />} />
      <Route path='/Home' element={<Home />} />
        <Route path='/GPS' element={<GPS />} />

    </Routes>
  )
}

export default App
