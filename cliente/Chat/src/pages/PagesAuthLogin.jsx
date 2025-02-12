import React from 'react'
import ComponentFormAuth from '../components/formAuth/ComponentFormAuth'

function PagesAuthLogin() {
  return (
   <section style={{width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <ComponentFormAuth registerPage={false}></ComponentFormAuth>
   </section>
  )
}

export default PagesAuthLogin
