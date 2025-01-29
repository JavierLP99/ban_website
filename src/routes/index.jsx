import { Routes, Route } from 'react-router-dom'
import { Home, About } from '@/pages'
import ProductDetail from '../pages/ProductDetail'
import ErrorBoundary from './ErrorBoundary'

const App = () => {
  return (
    <Routes>
      <Route
        path='/'
        element={<Home />}
        errorElement={
          <ErrorBoundary>
            <h1>Something went wrong.</h1>
          </ErrorBoundary>
        }
      />
      <Route
        path='/acercade'
        element={<About />}
        errorElement={
          <ErrorBoundary>
            <h1>Something went wrong.</h1>
          </ErrorBoundary>
        }
      />
      <Route
        path='/producto/:productName'
        element={<ProductDetail />}
        errorElement={
          <ErrorBoundary>
            <h1>Something went wrong.</h1>
          </ErrorBoundary>
        }
      />{' '}
    </Routes>
  )
}

export default App
