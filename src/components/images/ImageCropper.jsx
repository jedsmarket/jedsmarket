import { Cancel } from '@mui/icons-material';
import CropIcon from '@mui/icons-material/Crop';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import Cropper from 'react-easy-crop';

function ImageCropper({
  photoURL,
  setOpenCrop,
  openCrop,
  title,
  cropImage,
  disallowChange,
  handleImage,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const cropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const zoomPercent = (value) => {
    return `${Math.round(value * 100)}%`;
  };

  return (
    <Dialog open={openCrop}>
      <DialogTitle>
        <Typography align='center' fullWidth>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          background: '#333',
          position: 'relative',
          height: 500,
          width: 'auto',
          minWidth: { sm: 500 },
        }}
      >
        <Cropper
          image={photoURL}
          crop={crop}
          zoom={zoom}
          aspect={1}
          rotation={rotation}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropChange={setCrop}
          onCropComplete={cropComplete}
        />
      </DialogContent>
      <DialogActions sx={{ flexDirection: 'column', mx: 3, my: 2 }}>
        <Box sx={{ width: '100%', mb: 1 }}>
          <Box>
            <Typography>Zoom: {zoomPercent(zoom)}</Typography>
            <Slider
              valueLabelDisplay='auto'
              valueLabelFormat={zoomPercent}
              min={1}
              max={4}
              step={0.1}
              value={zoom}
              onChange={(e, zoom) => setZoom(zoom)}
            />
          </Box>
          <Box>
            <Typography>Rotation: {rotation}</Typography>
            <Slider
              valueLabelDisplay='auto'
              min={0}
              max={360}
              step={0.1}
              value={rotation}
              onChange={(e, rotation) => setRotation(rotation)}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {!disallowChange && (
            <Box>
              <input
                type='file'
                accept='image/*'
                className='form-control'
                hidden
                onChange={handleImage}
                required
                style={{ display: 'none' }}
                id='raised-button-file'
              />
              <label htmlFor='raised-button-file'>
                <Button
                  variant='text'
                  startIcon={<CameraswitchIcon />}
                  component='span'
                >
                  {'Change'}
                </Button>
              </label>
            </Box>
          )}
          <Button
            variant='outlined'
            startIcon={<Cancel />}
            onClick={(e) => {
              setOpenCrop(false);
              setZoom(1);
              setCrop({ x: 0, y: 0 });
              setRotation(0);
            }}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            startIcon={<CropIcon />}
            onClick={(e) => {
              cropImage({ croppedAreaPixels, rotation, photoURL });
              setTimeout(() => {
                setZoom(1);
                setCrop({ x: 0, y: 0 });
                setRotation(0);
              }, 2000);
            }}
          >
            Upload
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}

export default ImageCropper;
