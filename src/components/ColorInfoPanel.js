// src/components/ColorInfoPanel.js
import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Tooltip,
  Button,
} from '@mui/material';

function luminance(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  r = r <= 0.03928 ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4;
  g = g <= 0.03928 ? g / 12.92 : ((g + 0.055) / 1.055) ** 2.4;
  b = b <= 0.03928 ? b / 12.92 : ((b + 0.055) / 1.055) ** 2.4;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(l1, l2) {
  return (l1 + 0.05) / (l2 + 0.05);
}

const ColorInfoPanel = ({ color1, color2, onClose }) => {
  if (!color1) return null;

  const l1 = luminance(color1.r, color1.g, color1.b);
  const l2 = color2 ? luminance(color2.r, color2.g, color2.b) : null;
  const ratio = l2 ? contrastRatio(Math.max(l1, l2), Math.min(l1, l2)) : null;
  const insufficient = ratio && ratio < 4.5;

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6">Цветовая информация</Typography>

      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
        <ColorSwatch color={color1} label="Цвет 1" />
        {color2 && <ColorSwatch color={color2} label="Цвет 2" />}
      </Box>

      {ratio && (
        <Typography color={insufficient ? 'error' : 'inherit'} sx={{ mt: 1 }}>
          Контраст: {ratio.toFixed(2)}:1
          {insufficient && ' (недостаточно для WCAG)'}
        </Typography>
      )}

      <Button onClick={onClose} variant="contained" size="small" sx={{ mt: 1 }}>
        Закрыть
      </Button>
    </Paper>
  );
};

const ColorSwatch = ({ color, label }) => {
  const rgb = `rgb(${color.r}, ${color.g}, ${color.b})`;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Typography variant="body2">{label}</Typography>
      <Tooltip title={`RGB: ${color.r}, ${color.g}, ${color.b}`}>
        <Box
          sx={{
            width: 30,
            height: 30,
            backgroundColor: rgb,
            border: '1px solid #000',
          }}
        ></Box>
      </Tooltip>
      <Typography variant="caption">
        RGB: {color.r}, {color.g}, {color.b}
      </Typography>
    </Box>
  );
};

export default ColorInfoPanel;