// src/components/CanvasDisplay.js
import React, { useEffect, useRef } from 'react';

const CanvasDisplay = ({ image, onPickColor, scale = 100 }) => {
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

    const padding = 50;
    const availableWidth = window.innerWidth - padding * 2;
    const availableHeight = window.innerHeight - padding * 2;

    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const ratio = Math.min(availableWidth / img.width, availableHeight / img.height);
      const drawWidth = img.width * ratio * (scale / 100);
      const drawHeight = img.height * ratio * (scale / 100);

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, (canvas.width - drawWidth) / 2, (canvas.height - drawHeight) / 2, drawWidth, drawHeight);
    };

    img.onerror = () => {
      console.error("Ошибка при загрузке изображения на canvas");
    };

    img.src = image;
  }, [image, scale]);

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