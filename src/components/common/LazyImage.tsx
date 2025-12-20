import React, { useState, useEffect, useRef } from 'react';
import '../../styles/components/LazyImage.css';

interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  width?: string | number;
  height?: string | number;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder = '/placeholder-image.png',
  className = '',
  width = '100%',
  height = 'auto'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      setHasError(true);
      return;
    }

    const img = new Image();
    
    img.onload = () => {
      setIsLoading(false);
      setIsLoaded(true);
      setHasError(false);
    };
    
    img.onerror = () => {
      setIsLoading(false);
      setIsLoaded(false);
      setHasError(true);
    };
    
    img.src = src;
  }, [src]);

  return (
    <div 
      className={`lazy-image-container ${className}`}
      style={{ width, height }}
    >
      {isLoading && (
        <div className="lazy-image-placeholder">
          <div className="loading-spinner"></div>
        </div>
      )}
      
      {hasError ? (
        <div className="lazy-image-error">
          <span>⚠️</span>
        </div>
      ) : (
        <img
          ref={imgRef}
          src={isLoaded ? src : placeholder}
          alt={alt}
          className={`lazy-image ${isLoaded ? 'loaded' : 'loading'}`}
          style={{ 
            width: '100%', 
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0.7
          }}
        />
      )}
    </div>
  );
};

export default LazyImage;