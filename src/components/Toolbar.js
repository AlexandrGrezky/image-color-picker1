// src/components/Toolbar.js
import React, { useState } from 'react';
import {
  Box,
  Button,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

const Toolbar = ({ activeTool, setActiveTool }) => {
  const handleToolChange = (e, newTool) => {
    if (newTool !== null) {
      setActiveTool(newTool);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <ToggleButtonGroup
        value={activeTool}
        exclusive
        onChange={handleToolChange}
        aria-label="tool selector"
      >
        <ToggleButton value="hand" aria-label="Hand Tool">
          Рука
        </ToggleButton>
        <ToggleButton value="pipette" aria-label="Pipette Tool">
          Пипетка
        </ToggleButton>
      </ToggleButtonGroup>

      <Tooltip title="Ctrl + P — активировать пипетку | H — рука">
        <Button variant="outlined">Горячие клавиши</Button>
      </Tooltip>
    </Box>
  );
};

export default Toolbar;