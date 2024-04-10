import React from 'react'
import CommonTable from './CommonTable'

export default function User() {
    let userrole = sessionStorage.getItem("userrole");
  return (
    <div>
      <CommonTable userrole={userrole}/>
    </div>
  )
}
