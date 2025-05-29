// src/App.js
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box
} from '@mui/material';

import ImageUploader from './components/ImageUploader';
import CanvasDisplay from './components/CanvasDisplay';
import ColorInfoPanel from './components/ColorInfoPanel';
import Toolbar from './components/Toolbar';
import ResizeImageModal from './components/ResizeImageModal';
import CurvesCorrectionModal from './components/CurvesCorrectionModal';

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [scale, setScale] = useState(100);
  const [activeTool, setActiveTool] = useState('hand');
  const [originalSize, setOriginalSize] = useState(null);
  const [color1, setColor1] = useState(null);
  const [color2, setColor2] = useState(null);
  const [openResizeModal, setOpenResizeModal] = useState(false);
  const [openCurvesModal, setOpenCurvesModal] = useState(false);

  const handleSelectColor = (pixel, x, y, isSecondary) => {
    const color = { r: pixel[0], g: pixel[1], b: pixel[2], x, y };
    if (isSecondary) {
      setColor2(color);
    } else {
      setColor1(color);
    }
  };

  const handleApplyCurves = (lut) => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        data[i] = lut[data[i]];     // R
        data[i + 1] = lut[data[i + 1]]; // G
        data[i + 2] = lut[data[i + 2]]; // B
      }

      ctx.putImageData(imageData, 0, 0);
      setImageSrc(canvas.toDataURL());
    };
    img.src = imageSrc;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Image Editor с градационной коррекцией
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
        <button onClick={() => setOpenResizeModal(true)}>Изменить размер</button>
        <button onClick={() => setOpenCurvesModal(true)} style={{ marginLeft: '1rem' }}>Коррекция кривых</button>
        <button
          onClick={() => {
            const canvas = document.querySelector('canvas');
            const link = document.createElement('a');
            link.download = 'image.png';
            link.href = canvas.toDataURL();
            link.click();
          }}
          style={{ marginLeft: '1rem' }}
        >
          Сохранить
        </button>
      </Box>

      <ResizeImageModal
        open={openResizeModal}
        onClose={() => setOpenResizeModal(false)}
        originalSize={originalSize}
        onResize={(canvas) => setImageSrc(canvas.toDataURL())}
      />

      <CurvesCorrectionModal
        open={openCurvesModal}
        onClose={() => setOpenCurvesModal(false)}
        imageSrc={imageSrc}
        onApply={handleApplyCurves}
      />
    </Container>
  );
}

export default App;