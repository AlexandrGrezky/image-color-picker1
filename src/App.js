import React, { useState } from 'react';
import { Container, Typography } from '@mui/material';
import ImageUploader from './components/ImageUploader';
import CanvasDisplay from './components/CanvasDisplay';
import ColorInfoPanel from './components/ColorInfoPanel';

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [colorData, setColorData] = useState(null);

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Image Color Picker
      </Typography>
      <ImageUploader setImage={setImageSrc} />
      <CanvasDisplay image={imageSrc} onPickColor={setColorData} />
      <ColorInfoPanel data={colorData} />
    </Container>
  );
}

export default App;