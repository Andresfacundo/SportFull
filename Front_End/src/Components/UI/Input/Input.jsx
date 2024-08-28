// import React from 'react'
// import './Input.css'


// export const Input = ({id,className_input,content}) => {
//   return (
//     <div className='input'>
//         <label className='label' htmlFor={id}>{content}</label>
//         <input className={className_input} id={id} type="text" />
//     </div>
//   )
// }


import React from 'react'
import './Input.css'

const Input = (content,{value,set}) => {
  return (
      <div className='form_inputs'>

         <label className='form_label'>
          <input type='text' placeholder=' ' className='form_input' value={value} onChange={(e)=>setNombre (e.target.value)} />
          <span  className='form_text'>{content.name}</span>
         </label>

      </div>
   
  )
}

export default Input
