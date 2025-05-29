// src/App.js
import React, { useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';

import ImageUploader from './components/ImageUploader';
import CanvasDisplay from './components/CanvasDisplay';
import ColorInfoPanel from './components/ColorInfoPanel';
import ResizeImageModal from './components/ResizeImageModal';

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [colorData, setColorData] = useState(null);
  const [scale, setScale] = useState(100);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0, src: null });
  const [resizedImage, setResizedImage] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handlePickColor = (data) => {
    setColorData(data);
  };

  const handleScaleChange = (e) => {
    setScale(Number(e.target.value));
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleResizeImage = (canvas) => {
    const resizedDataURL = canvas.toDataURL();
    setResizedImage({
      width: canvas.width,
      height: canvas.height,
    });
    setImageSrc(resizedDataURL);
  };

  const handleSaveImage = () => {
    const canvas = document.querySelector('canvas');
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Image Editor
      </Typography>

      <ImageUploader setImage={setImageSrc} setOriginalSize={setOriginalSize} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Typography>Zoom:</Typography>
        <input
          type="range"
          min="12"
          max="300"
          value={scale}
          onChange={handleScaleChange}
        />
        <Typography>{scale}%</Typography>
      </Box>

      <CanvasDisplay image={imageSrc} onPickColor={handlePickColor} scale={scale} />

      <ColorInfoPanel
        data={colorData}
        originalSize={originalSize}
        resizedSize={resizedImage}
      />

      <Box mt={2}>
        <Button variant="contained" onClick={handleOpenModal}>Изменить размер</Button>
        <Button variant="contained" onClick={handleSaveImage} style={{ marginLeft: '1rem' }}>Сохранить</Button>
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