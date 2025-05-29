// src/components/CurvesCorrectionModal.js
import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
} from '@mui/material';

const CurvesCorrectionModal = ({ open, onClose, imageSrc, onApply }) => {
  const canvasRef = useRef(null);
  const [point1, setPoint1] = useState({ in: 0, out: 0 });
  const [point2, setPoint2] = useState({ in: 255, out: 255 });
  const [previewEnabled, setPreviewEnabled] = useState(false);

  // Функция построения гистограммы
  const drawHistograms = useCallback((ctx, imageData) => {
    //const width = 256;
    const height = 100;

    for (let channel = 0; channel < 3; channel++) {
      const hist = new Array(256).fill(0);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        hist[data[i + channel]]++;
      }

      const max = Math.max(...hist);
      ctx.fillStyle = ['red', 'green', 'blue'][channel];

      for (let i = 0; i < 256; i++) {
        const barHeight = (hist[i] / max) * height;
        ctx.fillRect(i, height - barHeight, 1, barHeight);
      }
    }

    drawControlLines(ctx);
  }, [point1.out, point2.out]);

  // Функция рисования линий между точками
  const drawControlLines = useCallback((ctx) => {
    const height = 100;

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(point1.in, height - point1.out);
    ctx.lineTo(point2.in, height - point2.out);
    ctx.stroke();

    ctx.setLineDash([4]);
    ctx.strokeStyle = 'gray';
    ctx.beginPath();
    ctx.moveTo(0, height - point1.out);
    ctx.lineTo(256, height - point1.out); // замените width на 256
    ctx.moveTo(0, height - point2.out);
    ctx.lineTo(256, height - point2.out);
    ctx.stroke();
    ctx.setLineDash([]);
  }, []);

  // Отрисовка гистограмм при открытии модального окна
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageSrc) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 256, 100);

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(img, 0, 0);
      const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
      drawHistograms(ctx, imageData);
    };
    img.src = imageSrc;
  }, [open, imageSrc, drawHistograms]);

  // Сброс точек
  const resetPoints = () => {
    setPoint1({ in: 0, out: 0 });
    setPoint2({ in: 255, out: 255 });
    if (previewEnabled) applyCurve();
  };

  // Применение коррекции
  const applyCurve = () => {
    const lut = buildLUT();
    onApply(lut);
    if (!previewEnabled) onClose();
  };

  // Построение LUT-таблицы
  const buildLUT = () => {
    const lut = new Uint8ClampedArray(256);
    const slope = (point2.out - point1.out) / (point2.in - point1.in);

    for (let i = 0; i < 256; i++) {
      let val;
      if (i <= point1.in) {
        val = point1.out;
      } else if (i >= point2.in) {
        val = point2.out;
      } else {
        val = point1.out + slope * (i - point1.in);
      }
      lut[i] = Math.min(255, Math.max(0, Math.round(val)));
    }

    return lut;
  };

  // Обработчики полей ввода
  const handleChangePoint1In = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= point2.in) {
      setPoint1((prev) => ({ ...prev, in: value }));
    }
  };

  const handleChangePoint1Out = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 255) {
      setPoint1((prev) => ({ ...prev, out: value }));
    }
  };

  const handleChangePoint2In = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= point1.in && value <= 255) {
      setPoint2((prev) => ({ ...prev, in: value }));
    }
  };

  const handleChangePoint2Out = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 255) {
      setPoint2((prev) => ({ ...prev, out: value }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Коррекция кривыми</DialogTitle>
      <DialogContent>
        <canvas ref={canvasRef} width={256} height={100} style={{ border: '1px solid #ccc' }} />

        <TextField label="Вход 1" type="number"
                   fullWidth margin="dense"
                   value={point1.in}
                   onChange={handleChangePoint1In} />

        <TextField label="Выход 1" type="number"
                   fullWidth margin="dense"
                   value={point1.out}
                   onChange={handleChangePoint1Out} />

        <TextField label="Вход 2" type="number"
                   fullWidth margin="dense"
                   value={point2.in}
                   onChange={handleChangePoint2In} />

        <TextField label="Выход 2" type="number"
                   fullWidth margin="dense"
                   value={point2.out}
                   onChange={handleChangePoint2Out} />

        <FormControlLabel
          control={<Checkbox checked={previewEnabled} onChange={(e) => setPreviewEnabled(e.target.checked)} />}
          label="Предпросмотр"
        />

        <Button variant="outlined" fullWidth onClick={resetPoints}>
          Сбросить
        </Button>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
        <Button onClick={applyCurve} variant="contained">Применить</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CurvesCorrectionModal;