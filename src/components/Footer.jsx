import { useRef, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { Modal, Button } from 'react-bootstrap'
import emailjs from '@emailjs/browser'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { getResizedCloudinaryUrl } from '../utils/tools'
import { useAuth } from 'react-oidc-context'

const schema = yup
  .object({
    email: yup.string().required('Ingesa un email para contactarte')
  })
  .required()

const Footer = () => {
  const [categories, setCategories] = useState([])
  const [seasons, setSeasons] = useState([])
  const [showModal, setShowModal] = useState(false)
  const form = useRef()
  const auth = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({ resolver: yupResolver(schema) })

  const whenSubmit = () => {
    emailjs
      .sendForm(
        'service_d6s5ar5',
        'template_9ffmfaw',
        form.current,
        'XRcANWSPimH7Fxmnv'
      )
      .then(
        () => {
          console.log('SUCCESS!')
        },
        error => {
          console.log('FAILED...', error.text)
        }
      )

    const result = { email: '' }
    reset(result)
    setShowModal(true)
  }

  useEffect(() => {
    axios
      .all([
        axios.get(`https://banannylandapp.onrender.com/categories`),
        axios.get('https://banannylandapp.onrender.com/seasons')
      ])
      .then(([categoriesRes, seasonRes]) => {
        setCategories(categoriesRes.data.categories || [])
        setSeasons(seasonRes.data.seasons || [])
      })
      .catch(error => console.error('Error al cargar la información:', error))
  }, [])

  return (
    <footer className='bg-light text-dark py-5'>
      <div className='container'>
        <div className='justify-content-center align-items-center'>
          <div className='row'>
            <div className='col-md-3'>
              <a href='/'>
                <img
                  src={getResizedCloudinaryUrl('/Logo.png', 't_Small')}
                  alt='Logo'
                  className='img-fluid me-3'
                />
              </a>
              <div className='d-flex justify-content-center'>
                <a
                  href='https://www.facebook.com/profile.php?id=100086273566786'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-black me-3'
                >
                  <i className='bi-facebook' style={{ fontSize: '1.5rem' }}></i>
                </a>
                <a
                  href='https://www.instagram.com/banannyland/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-black me-3'
                >
                  <i
                    className='bi-instagram'
                    style={{ fontSize: '1.5rem' }}
                  ></i>
                </a>
                <a
                  href='https://wa.me/522291324720'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-black me-3'
                >
                  <i className='bi-whatsapp' style={{ fontSize: '1.5rem' }}></i>
                </a>
              </div>
            </div>
            <div className='text-black col-md-3'>
              <h6>Páginas</h6>
              <ul className='list-unstyled footer-links'>
                <li>
                  <a href='/'>Inicio</a>
                </li>
                <li>
                  <a href='/promotions'>Promociones</a>
                </li>
              </ul>
              <h6>Categorías</h6>
              <ul className='list-unstyled footer-links'>
                {categories.map(item => (
                  <li key={item.name}>
                    <a href={`/search?category=${item.name}`}>{item.name}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className='text-black col-md-3'>
              <h6>Temporadas</h6>
              <ul className='list-unstyled footer-links'>
                {seasons.map(season => (
                  <li key={season.name}>
                    <a
                      href={`/search?season=${encodeURIComponent(season.name)}`}
                    >
                      {season.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className='text-black col-md-3'>
              <h6>Entérate de nuestras promociones</h6>
              <p>
                Envíanos tu correo por si gustarías enterarte de nuestros nuevos
                producots antes que todos
              </p>
              <form
                onSubmit={handleSubmit(whenSubmit)}
                ref={form}
                className='d-block'
                name='contact'
              >
                <div className='row'>
                  <div className='col-8 col-md-12 col-xl-9'>
                    <input
                      type='text'
                      name='email'
                      placeholder='correo@mail.com'
                      id='email'
                      {...register('email')}
                      className='my-2 p-2 border border-2 col-12'
                    />
                    <p className='text-warning text-center'>
                      {errors.email?.message}
                    </p>
                  </div>
                  <div className='d-flex align-items-center col-4 col-xl-3'>
                    <button
                      type='submit'
                      className='btn btn-primary rounded-pill text-light'
                    >
                      Enviar
                    </button>
                  </div>
                </div>
              </form>
              <p>Mándanos un mensaje</p>
              <p className='mb-1'>
                <strong>WhatsApp: </strong>
                <a
                  href='https://wa.me/522291324720'
                  target='_blank'
                  className='text-black'
                >
                  +52 55 5555 5555
                </a>
              </p>
              <p className='mb-1'>
                <strong>Email: </strong>
                <a
                  href='mailto:soporte.banannyland@gmail.com'
                  className='text-black'
                >
                  soporte.banannyland@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className='row mt-4'>
          <p className='mb-0 col'>
            © 2025 Banannyland. Todos los derechos reservados.
          </p>
          <button className='btn col-2' onClick={() => auth.signinRedirect()}>
            <ul className='list-unstyled footer-links'>
              <li className='me-1 hover-underline'>Iniciar sesión</li>
            </ul>
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
