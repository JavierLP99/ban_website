import { useState, useEffect } from 'react'
import axios from 'axios'
import Banner from '@/components/home/Banner.jsx'
import MostSold from '../components/home/MostSold'
import Contact from '../components/home/Contact'
import Categories from '../components/home/Categories'
import NewProducts from '../components/home/NewProducts'

const Home = () => {
  const [banners, setBanners] = useState([])
  const [categories, setCategories] = useState([])
  const [newProducts, setNewProducts] = useState([])
  const [mostSold, setMostSold] = useState([])

  useEffect(() => {
    axios
      .all([
        axios.get('https://1zy0q39b80.execute-api.eu-north-1.amazonaws.com/banannyland-api/banners'),
        axios.get(`https://1zy0q39b80.execute-api.eu-north-1.amazonaws.com/banannyland-api/categories`, {
          params: {
            limit: 5
          }
        }),
      axios
        .get(
          'https://1zy0q39b80.execute-api.eu-north-1.amazonaws.com/banannyland-api/products?page=1&limit=3&sortBy=updatedAt&order=asc'
        ),
    axios
      .get(
        'https://1zy0q39b80.execute-api.eu-north-1.amazonaws.com/banannyland-api/products?page=1&limit=8&sortBy=updatedAt&order=desc'
      )
      ])
      .then(([bannersRes, categoriesRes, newProductsRes, mostSoldRes]) => {
        const filteredBanners = bannersRes.data.banners.filter(
          b => b.status === 'Valida'
        )
        setBanners(filteredBanners)
        setCategories(categoriesRes.data.categories)
        setNewProducts(newProductsRes.data.products)
        setMostSold(mostSoldRes.data.products)
      })
      .catch(error => console.log('Error al cargar la información:', error))
  }, [])

  return (
    <main>
      <Banner content={banners} />
      <Categories data={categories} />
      <NewProducts data={newProducts}/>
      <MostSold data={mostSold} />
      <Contact />
    </main>
  )
}

export default Home
