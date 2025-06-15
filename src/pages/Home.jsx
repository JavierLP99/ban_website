import Banner from '@/components/home/Banner.jsx'
import MostSold from '../components/home/MostSold'
import Contact from '../components/home/Contact'
import Categories from '../components/home/Categories'
import NewProducts from '../components/home/NewProducts'
const Home = () => {
  return (
    <main>
      <Banner />
      <Categories />
      <NewProducts />
      <MostSold />
      <Contact />
    </main>
  )
}

export default Home
