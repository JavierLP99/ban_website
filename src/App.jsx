import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import RoutesIndex from './routes'
import Header from './components/Header'
import Footer from './components/Footer'
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: import.meta.env.VITE_COGNITO_AUTHORITY,
  client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_COGNITO_REDIRECT_URI,
  response_type: "code",
  scope: "phone openid email",
};

console.log(cognitoAuthConfig)
function App () {
  const updateUrl = url => {
    const newHeight = window.innerHeight

    // Extract the width (w) and height (h) parameters from the URL using stricter regular expressions
    const widthMatch = url.match(/w(\d+)(?=-h\d+)/) // Look for "w" followed by digits and "-h"
    const heightMatch = url.match(/h(\d+)(?=-s)/) // Look for "h" followed by digits and "-s"

    if (widthMatch && heightMatch) {
      const currentWidth = parseInt(widthMatch[1], 10)
      const currentHeight = parseInt(heightMatch[1], 10)

      // Calculate the proportional new width
      const newWidth = Math.round((currentWidth / currentHeight) * newHeight)
      // Replace the old width and height with the new values, keeping boundaries intact
      const updatedUrl = url
        .replace(/w\d+(?=-h\d+)/, `w${newWidth}`)
        .replace(/h\d+(?=-s)/, `h${newHeight}`)

      return updatedUrl
    }

    // Return the original URL if no width/height parameters are found
    return url
  }

  const router = createBrowserRouter(
    [
      {
        path: '/*',
        element: (
          <AuthProvider {...cognitoAuthConfig}>

            <div
              className='background-image'
              style={{
                backgroundImage: `url(${updateUrl(
                  'https://lh3.googleusercontent.com/pw/AP1GczMPVpG7b1li6wTGs1JO14t7ilu8qdZBVhJgNfsGOF26Q9Tv6l38YkuXx9gIkhny8PlQYAiSfvr74PhnReQDR7w3vovV8Xp5oQzPwdh0FopRPZQzS7Rr_r495VA6rCGmU3DYus7SkH1GN7K5SDM9iLnq=w1344-h938-s-no?authuser=0'
                )})`
                // backgroundImage: `url(${backgroundImage})`
              }}
            >
            <Header /> {/* Header now inside Router context */}
            <RoutesIndex />
            </div>
          </AuthProvider>
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
      <Footer />
    </>
  )
}

export default App
