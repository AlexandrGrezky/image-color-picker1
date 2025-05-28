import React, { useEffect, useRef } from 'react';

const CanvasDisplay = ({ image, onPickColor }) => {
  const canvasRef = useRef(null);
  const imgRef = useRef(new Image());

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;

    if (!image) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };

    img.src = image;
  }, [image]);

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    const ctx = canvas.getContext('2d');
    const pixel = ctx.getImageData(x, y, 1, 1).data;

    onPickColor({
      x,
      y,
      r: pixel[0],
      g: pixel[1],
      b: pixel[2],
      width: canvas.width,
      height: canvas.height,
    });
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      style={{ border: '1px solid #ccc', cursor: 'pointer', display: 'block', marginTop: '1rem' }}
    />
  );
};

export default CanvasDisplay;