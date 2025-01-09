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
            'https://lh3.googleusercontent.com/pw/AP1GczMPVpG7b1li6wTGs1JO14t7ilu8qdZBVhJgNfsGOF26Q9Tv6l38YkuXx9gIkhny8PlQYAiSfvr74PhnReQDR7w3vovV8Xp5oQzPwdh0FopRPZQzS7Rr_r495VA6rCGmU3DYus7SkH1GN7K5SDM9iLnq=w1344-h938-s-no?authuser=0'
          )})`
          // backgroundImage: `url(${backgroundImage})`
        }}
      >
      <Banner />
      <Categories />
      <NewProducts />
      <MostSold />
      </div>
    </div>
  )
}

export default Home
