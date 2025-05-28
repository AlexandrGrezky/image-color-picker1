import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';

import ImageUploader from './components/ImageUploader';
import CanvasDisplay from './components/CanvasDisplay';
import ColorInfoPanel from './components/ColorInfoPanel';
import ResizeImageModal from './components/ResizeImageModal';

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [colorData, setColorData] = useState(null);
  const [scale, setScale] = useState(100);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
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

  const handleResizeImage = (newImage) => {
    setResizedImage(newImage);
    setImageSrc(newImage.toDataURL());
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Image Editor
      </Typography>

      <ImageUploader setImage={setImageSrc} setOriginalSize={setOriginalSize} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Typography>Zoom:</Typography>
        <input type="range" min="12" max="300" value={scale} onChange={handleScaleChange} />
        <Typography>{scale}%</Typography>
      </Box>

      <CanvasDisplay image={imageSrc} onPickColor={handlePickColor} scale={scale} />

      <ColorInfoPanel data={colorData} originalSize={originalSize} resizedSize={resizedImage ? resizedImage.size : null} />

      <Box mt={2}>
        <button onClick={handleOpenModal}>Изменить размер</button>
        <button onClick={() => {
          const canvas = document.querySelector('canvas');
          const link = document.createElement('a');
          link.download = 'image.png';
          link.href = canvas.toDataURL();
          link.click();
        }}>Сохранить</button>
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