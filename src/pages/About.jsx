import { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';

const Banner = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetch('/home.json') // Adjust the path as needed
      .then((response) => response.json())
      .then((data) => setContent(data.banner))
      .catch((error) => console.error('Error loading content:', error));
  }, []);

  if (!content) return <div>Loading...</div>;

  return (
    <div className="position-relative vh-100 vw-100">
      {/* Background Carousel */}
      <Carousel className="vh-100 vw-100 position-absolute top-0 start-0" fade indicators={false} controls={false}>
        {content.backgroundImages.map((image, index) => (
          <Carousel.Item key={index}>
            <div
              className="d-block w-100 vh-100"
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            ></div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Overlay Content */}
      <div className="d-flex align-items-center text-white vh-100 vw-100 position-relative" style={{ zIndex: 2 }}>
        <div className="container align-content-center">
          {/* Hidden H1 for SEO */}
          <h1 className="visually-hidden">{content.title}</h1>

          {/* Visible Content */}
          <div className="text-start">
            <img src={content.logo} alt="Company Logo" className="mb-4 w-25" />
            <p className="lead display-3">{content.description}</p>
            <a href={content.buttonLink} className="btn btn-primary btn-lg mt-3 rounded-0">
              {content.buttonText}
            </a>
          </div>
        </div>
      </div>

      {/* Gradient Overlay for Better Text Visibility */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5))',
          zIndex: 1,
        }}
      ></div>
    </div>
  );
};

export default Banner;
