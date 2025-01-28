import React from 'react'
import ProductDescription from '../components/ProductDescription'
import { useParams } from "react-router-dom";


const ProductDetail = () => {
  const { productName } = useParams();
  console.log('test - ', productName)

  return (
    <div>
      <ProductDescription productName={productName}/>
    </div>
  )
}

export default ProductDetail
