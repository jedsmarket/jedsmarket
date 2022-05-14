import React from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { Box, useMediaQuery, useTheme } from '@mui/material';

export default function ImageCarousel({ images }) {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const theme = useTheme();

  let maxHeight = 0;
  let maxWidth = 0;
  let maxRatio = 0;
  let maxBoxHeight = isSmallScreen ? 'auto' : '80vh';
  let maxBoxWidth = isSmallScreen ? '80vw' : 'auto';
  let boxHeight = 0;
  let boxWidth = 0;

  images.map((img) => {
    let newImage = new Image();
    newImage.src = img.url;

    // Rescale the given image to a max of max_height and max_width

    let height = newImage.height;
    let width = newImage.width;
    let ratio = 0;
    if (height > width) {
      ratio = width / height;
    } else {
      ratio = height / width;
    }

    // If height or width are too large, they need to be scaled down
    // Multiply height and width by the same value to keep ratio constant
    if (height > maxHeight) {
      maxHeight = height;
    }

    if (width > maxWidth) {
      maxWidth = width;
    }

    if (ratio > maxRatio) {
      maxRatio = ratio;
    }

    boxWidth = ((maxWidth * maxRatio) / maxWidth) * 100;
    boxHeight = ((maxHeight * maxRatio) / maxHeight) * 100;

    return img;
  });

  return (
    <Carousel autoplay>
      {images.map((img) => (
        <Box
          sx={{
            justifyContent: 'center',
          }}
        >
          <Box
            component='img'
            src={img.url}
            alt={img.key}
            key={img.key}
            sx={{
              width: `${boxWidth}%`,
              height: `${boxHeight}%`,
              objectFit: 'contain',
              border: '1px solid grey',
              borderRadius: 2,
            }}
          />
        </Box>
      ))}
    </Carousel>
  );
}
