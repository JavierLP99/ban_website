import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import RoutesIndex from './routes'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Header from './components/Header'

function App() {

  const router = createBrowserRouter(
    [
      {
        path: '/*',
        element: (
          <>
            <Header  /> {/* Header now inside Router context */}
            <div style={{ marginTop: '30px' }}>
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
