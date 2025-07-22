import React from 'react'
import { useParams } from 'react-router-dom'

const one = () => {
    const data=useParams();
    console.log("---params",data)
  return (
    <div>one</div>
  )
}

export default one