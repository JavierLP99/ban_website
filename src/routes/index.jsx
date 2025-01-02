import { Routes, Route } from 'react-router-dom'
import { Home, About } from '@/pages'


const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/acercade' element={<About />} />
    </Routes>
  )
}

export default App