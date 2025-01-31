import { useEffect, useState } from 'react'

const Footer = () => {
  const [content, setContent] = useState(null)

  useEffect(() => {
    fetch('/footer.json')
      .then(response => response.json())
      .then(data => setContent(data))
      .catch(error => console.error('Error loading content:', error))
  }, [])

  const ImportDrivePhoto = (driveUrl, height) => {
    const defaultUrl =
      'https://drive.google.com/file/d/1Q7By_xG9r3a8Zr47j6b1HG7yAm91GIHO/view?usp=drive_link'

    const match = driveUrl.match(/\/d\/(.*)\//)
    const fileId = match ? match[1] : defaultUrl.match(/\/d\/(.*)\//)[1]

    const newUrl = `https://lh3.googleusercontent.com/d/${fileId}=h${height}`

    return newUrl
  }

  if (!content) return <div>Loading...</div>

  return (
    <footer className='bg-light text-dark py-4'>
      <div className='container'>
        <div className='row align-items-center'>
          <div className='row mt-4'>
            <div className='col-md-3'>
              <img
                src={ImportDrivePhoto(content.footer.logo, 250)}
                alt='Logo'
                className='img-fluid me-3'
                style={{ maxWidth: '300px' }}
              />
              <div className='d-flex justify-content-center'>
                {content.socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-black me-3'
                  >
                    <i
                      className={`bi ${social.icon}`}
                      style={{ fontSize: '1.5rem' }}
                    ></i>
                  </a>
                ))}
              </div>
            </div>
            <div className='text-black col-md-3'>
              <h6>Páginas</h6>
              <ul className='list-unstyled footer-links'>
                {content.pages.map((page, index) => (
                  <li key={index}>
                    <a href={page.link}>{page.name}</a>
                  </li>
                ))}
              </ul>
              <h6>Categorías</h6>
              <ul className='list-unstyled footer-links'>
                {content.categories.map((category, index) => (
                  <li key={index}>
                    <a href={category.link}>{category.name}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className='text-black col-md-3'>
              <h6>Temporadas</h6>
              <ul className='list-unstyled footer-links'>
                {content.seasons.map((category, index) => (
                  <li key={index}>
                    <a href={category.link}>{category.name}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className='text-black col-md-3'>
              <h6>Entérate de nuestras promociones</h6>
              <p>Suscríbete a nuestro newsletter</p>
              <form className='d-block' name='contact'>
                <div className='row'>
                <div className='col-8'>
                  <input
                    type='text'
                    name='email'
                    placeholder='correo@mail.com'
                    id='email'
                    className='my-2 p-2 border border-2'
                  />

                </div>
                <div className='d-flex align-items-center col-4'>
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
                <strong>Teléfono:</strong> {content.contactInfo.phone}
              </p>
              <p className='mb-1'>
                <strong>Email:</strong>{' '}
                <a
                  href={`mailto:${content.contactInfo.email}`}
                  className='text-black'
                >
                  {content.contactInfo.email}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className='row mt-4'>
          <div className='col text-black'>
            <p className='mb-0'>{content.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
