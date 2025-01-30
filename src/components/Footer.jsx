import { useEffect, useState } from 'react'

const Footer = () => {
  const [content, setContent] = useState([])

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
  
    return (
      <footer className="bg-dark-subtle text-dark py-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 d-flex align-items-center">
              <img src={ImportDrivePhoto(content.logo, 250)} alt="Logo" className="img-fluid me-3" style={{ maxWidth: "300px" }} />
            </div>
          </div>
  
          <div className="row mt-4">
            <div className="col-md-4">
              <h5>Páginas</h5>
              <ul className="list-unstyled footer-links">
                {content.pages.map((page, index) => (
                  <li key={index}>
                    <a href={page.link}>{page.name}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-4">
              <h5>Categorías</h5>
              <ul className="list-unstyled footer-links">
                {content.categories.map((category, index) => (
                  <li key={index}>
                    <a href={category.link}>{category.name}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-4">
              <h5>Contacto</h5>
              <p className="mb-1">
                <strong>Teléfono:</strong> {content.contactInfo.phone}
              </p>
              <p className="mb-1">
                <strong>Email:</strong> <a href={`mailto:${content.contactInfo.email}`} className="text-dark">{content.contactInfo.email}</a>
              </p>
              <p className="mb-3">
                <strong>Dirección:</strong> {content.contactInfo.address}
              </p>
              <div className="d-flex mb-3">
                {content.socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark me-3"
                  >
                    <i className={`bi ${social.icon}`} style={{ fontSize: "1.5rem" }}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
  
          <div className="row mt-4">
            <div className="col text-dark">
              <p className="mb-0">{content.copyright}</p>
            </div>
          </div>
        </div>
      </footer>
    )
  }
  
  export default Footer