import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import RoutesIndex from './routes'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Header from './components/Header'

function App() {
  const [headerHeight, setHeaderHeight] = useState(0)
  const headerRef = useRef(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    // Update Header height automatically
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight)
    }
    const handleResize = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight)
      }
    }
    window.addEventListener('resize', handleResize) // Changes on screen size
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const router = createBrowserRouter(
    [
      {
        path: '/*',
        element: (
          <>
            <Header ref={headerRef} /> {/* Header now inside Router context */}
            <div style={{ marginTop: headerHeight }}>
              <RoutesIndex />
            </div>
          </>
        )
      }
    ],
    {
      future: {
        v7_relativeSplatPath: true,
        v7_startTransition: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_skipActionErrorRevalidation: true
      }
    }
  )

  return (
    <>
      
      <RouterProvider router={router} />
    </>
  )
}

export default App
