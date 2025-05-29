// src/App.js
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
} from '@mui/material';

import ImageUploader from './components/ImageUploader';
import CanvasDisplay from './components/CanvasDisplay';
import ColorInfoPanel from './components/ColorInfoPanel';
import Toolbar from './components/Toolbar';
import ResizeImageModal from './components/ResizeImageModal';

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [scale, setScale] = useState(100);
  const [activeTool, setActiveTool] = useState('hand');
  const [originalSize, setOriginalSize] = useState(null);
  const [color1, setColor1] = useState(null);
  const [color2, setColor2] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleSelectColor = (pixel, x, y, isSecondary) => {
    const color = { r: pixel[0], g: pixel[1], b: pixel[2], x, y };
    if (isSecondary) {
      setColor2(color);
    } else {
      setColor1(color);
    }
  };

  const handleOpenModal = () => {
    if (!originalSize) {
      alert('Сначала загрузите изображение');
      return;
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleResizeImage = (canvas) => {
    setImageSrc(canvas.toDataURL());
    setOpenModal(false);
  };

  const handleSaveImage = () => {
    const canvas = document.querySelector('canvas');
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Image Editor с инструментами
      </Typography>

      <ImageUploader setImage={setImageSrc} setOriginalSize={setOriginalSize} />

      <Toolbar activeTool={activeTool} setActiveTool={setActiveTool} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Typography>Масштаб:</Typography>
        <input
          type="range"
          min="12"
          max="300"
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
        />
        <Typography>{scale}%</Typography>
      </Box>

      <CanvasDisplay
        image={imageSrc}
        scale={scale}
        activeTool={activeTool}
        onSelectColor={handleSelectColor}
      />

      {(color1 || color2) && (
        <ColorInfoPanel
          color1={color1}
          color2={color2}
          onClose={() => {
            setColor1(null);
            setColor2(null);
          }}
        />
      )}

      <Box mt={2}>
        <button onClick={handleOpenModal}>Изменить размер</button>
        <button onClick={handleSaveImage} style={{ marginLeft: '1rem' }}>Сохранить</button>
      </Box>

      <ResizeImageModal
        open={openModal}
        onClose={handleCloseModal}
        originalSize={originalSize}
        onResize={handleResizeImage}
      />
    </Container>
  );
}

export default App;