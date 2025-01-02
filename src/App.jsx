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
      <Header />
      <div>
        <div>
          <a href='https://vite.dev' target='_blank'>
            <img src={viteLogo} className='logo' alt='Vite logo' />
          </a>
          <a href='https://react.dev' target='_blank'>
            <img src={reactLogo} className='logo react' alt='React logo' />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className='card'>
          <button onClick={() => setCount(count => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.jsx</code> and save to test HMR
          </p>
        </div>
        <p className='read-the-docs'>
          Click on the Vite and React logos to learn more
        </p>
      </div>
      <RouterProvider router={router} />
    </>
  )
}

export default App
