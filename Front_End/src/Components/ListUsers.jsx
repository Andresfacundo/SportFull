import React, {useEffect, useState} from 'react'
import ClienteService from '../services/ClienteService'
import './ListUsers.css'

export const ListUsers = () => {

    const [users,setUsers]=useState([]);

    useEffect(()=>{
        ClienteService.getAllClientes().then(response=>{
            setUsers(response.data);
            console.log(response.data);
        }).catch(error =>{
            console.log(error);
        })
    },[])

  return (
    <div className='container'>
        <table className='custom-table'>
            <thead>
                <th>id</th>
                <th>nombre</th>
                <th>apellido</th>
                <th>email</th>
                <th>contraseña</th>
                <th>tipo usuario</th>
            </thead>
            <tbody>
                {
                    users.map(
                        user=>
                        <tr key={user.id}> 
                            <td>{user.nombre} </td>
                            <td>{user.apellido} </td>
                            <td>{user.email} </td>
                            <td>{user.contraseña} </td>
                            <td>{user.tipoUsuario} </td>

                        </tr>
                    )
                }
            </tbody>
        </table>

    </div>
  )
}

export default ListUsers;