// src/components/ResizeImageModal.js
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Tooltip,
} from '@mui/material';

const ResizeImageModal = ({ open, onClose, originalSize, onResize }) => {
  const [unit, setUnit] = useState('pixel');
  const [width, setWidth] = useState(originalSize?.width || 100);
  const [height, setHeight] = useState(originalSize?.height || 100);
  const [keepRatio, setKeepRatio] = useState(true);
  const [interpolation, setInterpolation] = useState('nearest');

  const handleChangeWidth = (e) => {
    const newWidth = Number(e.target.value);
    setWidth(newWidth);
    if (keepRatio && originalSize?.width && originalSize?.height) {
      const ratio = originalSize.height / originalSize.width;
      setHeight(Math.round(newWidth * ratio));
    }
  };

  const handleChangeHeight = (e) => {
    const newHeight = Number(e.target.value);
    setHeight(newHeight);
    if (keepRatio && originalSize?.width && originalSize?.height) {
      const ratio = originalSize.width / originalSize.height;
      setWidth(Math.round(newHeight * ratio));
    }
  };

  const applyResize = () => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, width, height);
      onResize(canvas);
    };
    img.src = originalSize?.src || '';
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Изменить размер</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel>Единицы</InputLabel>
          <Select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <MenuItem value="percent">Проценты</MenuItem>
            <MenuItem value="pixel">Пиксели</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Ширина"
          type="number"
          fullWidth
          margin="dense"
          value={width}
          onChange={handleChangeWidth}
        />

        <TextField
          label="Высота"
          type="number"
          fullWidth
          margin="dense"
          value={height}
          onChange={handleChangeHeight}
        />

        <FormControlLabel
          control={<Checkbox checked={keepRatio} onChange={(e) => setKeepRatio(e.target.checked)} />}
          label="Сохранять пропорции"
        />

        <Tooltip title="Ближайший сосед — простой алгоритм интерполяции, не создающий сглаживания.">
          <FormControl fullWidth margin="dense">
            <InputLabel>Интерполяция</InputLabel>
            <Select value={interpolation} onChange={(e) => setInterpolation(e.target.value)}>
              <MenuItem value="nearest">Ближайший сосед</MenuItem>
            </Select>
          </FormControl>
        </Tooltip>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={applyResize} variant="contained">Применить</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResizeImageModal;