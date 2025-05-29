// src/components/ImageUploader.js
import React from 'react';
import { Button, TextField } from '@mui/material';

const ImageUploader = ({ setImage, setOriginalSize }) => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        setOriginalSize({
          width: img.width,
          height: img.height,
          src: reader.result,
        });
        setImage(reader.result);
      };
      img.onerror = () => alert('Не удалось загрузить изображение.');
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    const url = e.target.url.value;

    if (!url.startsWith('http')) {
      alert('Введите корректный URL (начинающийся с http:// или https://)');
      return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      setOriginalSize({
        width: img.width,
        height: img.height,
        src: url,
      });
      setImage(url);
    };
    img.onerror = () => alert('Не удалось загрузить изображение по указанному URL.');
    img.src = url;
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileUpload} />
      <form onSubmit={handleUrlSubmit}>
        <TextField label="Image URL" name="url" variant="outlined" size="small" />
        <Button type="submit" variant="contained">Load by URL</Button>
      </form>
    </div>
  );
};

export default ImageUploader;