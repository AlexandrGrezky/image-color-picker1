// src/components/Toolbar.js
import React from 'react';
import {
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Tooltip,
} from '@mui/material';

const Toolbar = ({ activeTool, setActiveTool }) => {
  const handleToolChange = (e, newTool) => {
    if (newTool !== null) {
      setActiveTool(newTool);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <ToggleButtonGroup value={activeTool} exclusive onChange={handleToolChange}>
        <ToggleButton value="hand">Рука</ToggleButton>
        <ToggleButton value="pipette">Пипетка</ToggleButton>
      </ToggleButtonGroup>

      <Tooltip title="Ctrl + P — активировать пипетку | H — рука">
        <Button variant="outlined">Горячие клавиши</Button>
      </Tooltip>
    </Box>
  );
};

export default Toolbar;