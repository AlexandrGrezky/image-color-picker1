import React from 'react';
import { Button, TextField } from '@mui/material';

const ImageUploader = ({ setImage, setOriginalSize }) => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          // Передаем данные изображения и его размеры в App
          setImage(reader.result);
          setOriginalSize({
            width: img.width,
            height: img.height,
            src: reader.result
          });
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    const url = e.target.url.value;
    if (url) {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Чтобы не было ошибок с CORS
      img.onload = () => {
        // Передаем URL и размеры
        setImage(url);
        setOriginalSize({
          width: img.width,
          height: img.height,
          src: url
        });
      };
      img.src = url;
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileUpload} />
      <form onSubmit={handleUrlSubmit}>
        <TextField label="Image URL" name="url" variant="outlined" size="small" />
        <Button type="submit" variant="contained" color="primary">
          Load by URL
        </Button>
      </form>
    </div>
  );
};

export default ImageUploader;