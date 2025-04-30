import { Routes, Route } from 'react-router-dom'
import { Home, About, ProductsData, Banners, BannersPage } from '@/pages'
import ProductDetail from '../pages/ProductDetail'
import SearchPage from '../pages/SearchPage'
import EditProduct from '../pages/editProduct'
import Login from '../pages/Login'
import ErrorBoundary from './ErrorBoundary'
import RequireAuth from './RequireAuth' // Auth guard wrapper

const App = () => {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/acercade' element={<About />} />
        <Route path='/producto/:productName' element={<ProductDetail />} />
        <Route path='/admin/catalogo/:id' element={<EditProduct />} />
        <Route path='/admin/catalogo/' element={<EditProduct />} />
        <Route path='/search' element={<SearchPage />} />
        <Route
          path='/listadeproductos'
          element={
            <RequireAuth>
              <ProductsData />
            </RequireAuth>
          }
        />
        <Route
          path='/banners'
          element={
            <RequireAuth>
              <Banners />
            </RequireAuth>
          }
        />
        <Route
          path='/bannersPagina'
          element={
            <RequireAuth>
              <BannersPage />
            </RequireAuth>
          }
        />
        <Route path='/login' element={<Login />} />
      </Routes>
    </ErrorBoundary>
  )
}

export default App
