import React from 'react'
import {Route, Routes} from 'react-router-dom'
import PagesChat from './pages/PagesChat'
import PagesAuthLogin from './pages/PagesAuthLogin'
import PagesAuthRegister from './pages/PagesAuthRegister'

function App() {
  return (
   <Routes>
    <Route path='/' element={<PagesChat></PagesChat>}></Route>
    <Route path='/authLogin' element={<PagesAuthLogin></PagesAuthLogin>}></Route>
    <Route path='/authRegister' element={<PagesAuthRegister></PagesAuthRegister>}></Route>
   </Routes>
  )
}

export default App
