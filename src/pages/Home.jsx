import Banner from '@/components/home/Banner.jsx'
import MostSold from '../components/home/mostsold'

import Categories from '../components/home/Categories'
import NewProducts from '../components/home/NewProducts'
const Home = () => {
  

  return (
    <div>
      <Banner />
      <Categories />
      <NewProducts />
      <MostSold />
      </div>
  )
}

export default Home
