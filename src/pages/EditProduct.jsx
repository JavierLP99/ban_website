import React from 'react'
import ProductForm from '../components/ProductForm'
import { useParams } from "react-router-dom";


const EditProduct = () => {
  const { productName } = useParams();
  console.log('test - ', productName)

  return (
    <div>
      <ProductForm productName={productName}/>
    </div>
  )
}

export default EditProduct
