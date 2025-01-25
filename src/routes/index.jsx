import { Routes, Route } from 'react-router-dom'
import { Home, About } from '@/pages'
import ProductDetail from '../pages/ProductDetail'


const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/acercade' element={<About />} />
      <Route path='/producto' element={<ProductDetail />} />
    </Routes>
  )
}

export default App