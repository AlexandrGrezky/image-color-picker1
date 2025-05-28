import React from 'react';
import { Button, TextField } from '@mui/material';

const ImageUploader = ({ setImage }) => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    const url = e.target.url.value;
    if (url) setImage(url);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileUpload} />
      <form onSubmit={handleUrlSubmit}>
        <TextField label="Image URL" name="url" variant="outlined" size="small" />
        <Button type="submit" variant="contained" color="primary">Load by URL</Button>
      </form>
    </div>
  );
};

export default ImageUploader;