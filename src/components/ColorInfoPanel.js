import React from 'react';
import { Paper, Typography } from '@mui/material';

const ColorInfoPanel = ({ data }) => {
  if (!data) return null;

  const { x, y, r, g, b, width, height } = data;

  const colorBoxStyle = {
    backgroundColor: `rgb(${r}, ${g}, ${b})`,
    display: 'inline-block',
    width: 20,
    height: 20,
    marginRight: 8,
    border: '1px solid #333',
  };

  return (
    <Paper elevation={3} style={{ padding: '1rem', marginTop: '1rem' }}>
      <Typography variant="body1">
        <span style={colorBoxStyle}></span>
        Pixel at ({x}, {y}): RGB({r}, {g}, {b})
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Image size: {width} x {height} px
      </Typography>
    </Paper>
  );
};

export default ColorInfoPanel;