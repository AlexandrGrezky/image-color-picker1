import React, { useEffect, useRef } from 'react';

const CanvasDisplay = ({ image, onPickColor, scale }) => {
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
      const padding = 50;
      const availableWidth = window.innerWidth - padding * 2;
      const availableHeight = window.innerHeight - padding * 2;

      let drawWidth = img.width * (scale / 100);
      let drawHeight = img.height * (scale / 100);

      // Ограничиваем размеры, чтобы поместилось на экране
      const ratio = Math.min(availableWidth / img.width, availableHeight / img.height);
      drawWidth = img.width * ratio;
      drawHeight = img.height * ratio;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(img, (canvas.width - drawWidth) / 2, (canvas.height - drawHeight) / 2, drawWidth, drawHeight);
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
      style={{ border: '1px solid #ccc', cursor: 'pointer', display: 'block', width: '100%', height: '100%' }}
    />
  );
};

export default CanvasDisplay;