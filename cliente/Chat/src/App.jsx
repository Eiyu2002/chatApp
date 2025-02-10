import React from 'react'
import {Route, Routes} from 'react-router-dom'
import PagesChat from './pages/PagesChat'
import PagesAuth from './pages/PagesAuth'

function App() {
  return (
   <Routes>
    <Route path='/' element={<PagesChat></PagesChat>}></Route>
    <Route path='/auth' element={<PagesAuth></PagesAuth>}></Route>
   </Routes>
  )
}

export default App
