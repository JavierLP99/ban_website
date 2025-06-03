import { useRef, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Modal, Button } from 'react-bootstrap'
import emailjs from '@emailjs/browser'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

  const schema = yup
    .object({
      name: yup.string().required('Ingesa tu nombre'),
      phone: yup.string(),
      email: yup.string().required('Ingesa un email para contactarte'),
      message: yup.string().required('Escribe tu mensaje')
    })
    .required()
    
const Contact = () => {
  const [showModal, setShowModal] = useState(false)
  const form = useRef()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({ resolver: yupResolver(schema) })

  const handleCloseModal = () => setShowModal(false)

  const whenSubmit = data => {
    emailjs
      .sendForm('service_d6s5ar5', 'template_9ffmfaw', form.current, 'XRcANWSPimH7Fxmnv')
      .then(
        () => {
          console.log('SUCCESS!')
        },
        error => {
          console.log('FAILED...', error.text)
        }
      )

    const result = { email: '', phone: '', message: '' }
    reset(result)
    setShowModal(true)
  }

  const [content, setContent] = useState([])

  useEffect(() => {
    fetch('/home.json') // Adjust the path as needed
      .then(response => response.json())
      .then(data => setContent(data.contact))
      .catch(error => console.error('Error loading content:', error))
  }, [])

  if (!content) return <div>Loading...</div>

  return (
    <div className='py-5'>
      <div className='container text-center d-flex flex-column align-items-center'>
        <h2 className='fw-bold mb-3'>{content.title}</h2>
        <div className='rainbow-divider mb-3'></div>
        <div className='row justify-content-center'>
          <p className='text-justify text-center col-10'>
            {content.description}
          </p>
        </div>
        <div className='col-12 col-md-10 col-lg-8 col-xl-6'>
          <div className='row mx-auto col-12'>
            <form
              onSubmit={handleSubmit(whenSubmit)}
              ref={form}
              className='d-block'
              name='contact'
            >
              <div className='d-flex flex-column col-12'>
                <label htmlFor='name'>Nombre</label>
                <input
                  type='text'
                  name='name'
                  placeholder='nombre'
                  id='name'
                  {...register('name')}
                  className='my-2 p-2 border border-2'
                />
                <p className='text-warning text-center'>
                  {errors.name?.message}
                </p>
              </div>

              <div className='d-flex flex-column col-12'>
                <label htmlFor='email'>Correo</label>
                <input
                  type='text'
                  name='email'
                  placeholder='correo@mail.com'
                  id='email'
                  {...register('email')}
                  className='my-2 p-2 border border-2'
                />
                <p className='text-warning text-center'>
                  {errors.email?.message}
                </p>
              </div>

              <div className='d-flex flex-column col-12'>
                <label htmlFor='phone'>Teléfono (Opcional)</label>
                <input
                  type='text'
                  name='phone'
                  placeholder='55 1234 5678'
                  id='phone'
                  {...register('phone')}
                  className='my-2 p-2 border border-2'
                />
                <p className='text-warning text-center'>
                  {errors.phone?.message}
                </p>
              </div>

              <div className='d-flex flex-column col-12'>
                <label htmlFor='message'>Mensaje</label>
                <textarea
                  name='message'
                  placeholder='Escribe tu mensaje'
                  id='message'
                  {...register('message')}
                  className='my-2 p-2 border border-2'
                  rows='3'
                />
                <p className='text-warning text-center'>
                  {errors.message?.message}
                </p>
              </div>

              <div className='text-center'>
                <button
                  type='submit'
                  className='btn btn-primary rounded-pill text-light'
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={handleCloseModal}
        className='align-self-center'
        centered
      >
        <Modal.Body className='rounded'>
          <h2 className='text-center'>Gracias por contactarnos</h2>
          <p className='text-center'>Nos comunicaremos pronto contigo</p>

          <div className='text-center mt-4'>
            <Button variant='dark' onClick={handleCloseModal}>
              Cerrar
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <div className='row justify-content-center mx-auto mt-4 col-8'></div>
    </div>
  )
}

export default Contact
