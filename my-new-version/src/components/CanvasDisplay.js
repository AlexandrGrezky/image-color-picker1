// src/components/CanvasDisplay.js
import React, { useRef, useEffect, useState } from 'react';

const CanvasDisplay = ({ image, scale = 100, activeTool, onSelectColor }) => {
  const canvasRef = useRef(null);
  const imgRef = useRef(new Image());
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const scaledWidth = useRef(0);
  const scaledHeight = useRef(0);

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

    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const ratio = Math.min(availableWidth / img.width, availableHeight / img.height);
      scaledWidth.current = img.width * ratio * (scale / 100);
      scaledHeight.current = img.height * ratio * (scale / 100);

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        img,
        (canvas.width - scaledWidth.current) / 2 + panOffset.x,
        (canvas.height - scaledHeight.current) / 2 + panOffset.y,
        scaledWidth.current,
        scaledHeight.current
      );
    };

    img.src = image;
  }, [image, scale, panOffset]);

  const onMouseDown = (e) => {
    if (activeTool !== 'hand') return;

    let startX = e.clientX;
    let startY = e.clientY;

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      startX = moveEvent.clientX;
      startY = moveEvent.clientY;
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const imgX =
      (x - (canvas.width - scaledWidth.current) / 2 - panOffset.x) /
      (scaledWidth.current / imgRef.current.width);

    const imgY =
      (y - (canvas.height - scaledHeight.current) / 2 - panOffset.y) /
      (scaledHeight.current / imgRef.current.height);

    if (
      imgX >= 0 &&
      imgY >= 0 &&
      imgX < imgRef.current.width &&
      imgY < imgRef.current.height
    ) {
      const ctx = canvas.getContext('2d');
      const pixel = ctx.getImageData(x, y, 1, 1).data;

      onSelectColor(pixel, imgX, imgY, e.altKey || e.ctrlKey || e.shiftKey);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc' }}>
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        onMouseDown={onMouseDown}
        style={{ cursor: activeTool === 'hand' ? 'grab' : 'crosshair', width: '100%' }}
      />
    </div>
  );
};

export default CanvasDisplay;