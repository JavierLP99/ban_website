import Banner from '@/components/home/Banner.jsx'
import MostSold from '../components/home/mostsold'

import Categories from '../components/home/Categories'
import NewProducts from '../components/home/NewProducts'
const Home = () => {
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

  return (
    <div>
            <div
        className='background-image'
        style={{
          backgroundImage: `url(${updateUrl(
            'https://lh3.googleusercontent.com/pw/AP1GczNdbjNtDgUzkuST6avjfehTy00N2xjRMcLCAga2Crkte2y2cM96WZKv_nLkbPQIq2KxsgbuhscHtjp1lZ1-b3M3G-1UFveLa0pHClB8-P157Ju7mCKccGJCPTm5hoZaZM4dsXNKf5aT4RcyhIzY_1QB=w1290-h917-s-no-gm?authuser=0'
          )})`
          // backgroundImage: `url(${backgroundImage})`
        }}
      />
      <Banner/>
      <Categories />
      <NewProducts /> 
      <MostSold/>
    </div>
  )
}

export default Home
