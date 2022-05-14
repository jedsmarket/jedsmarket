import * as React from 'react';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import Link from '../nav/Link';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 22,
  height: 22,
  border: `2px solid ${theme.palette.background.paper}`,
}));

export default function ImagePreview({
  setOpenCrop,
  setPhotoURL,
  state,
  setState,
  isSubmitting,
}) {
  const { images, previewImages } = state;

  const handleRemove = (e, removeIndex) => {
    e.preventDefault();
    let newImages = state.images.filter((i, iIndex) => iIndex !== removeIndex);
    let newPreview = state.previewImages.filter(
      (i, iIndex) => iIndex !== removeIndex
    );

    setState({
      ...state,
      images: newImages,
      previewImages: newPreview,
    });
  };

  const handleImage = (e, url, cropKey) => {
    try {
      setOpenCrop(true);

      setState({ ...state, cropKey });

      return setPhotoURL(url);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Stack direction='row' spacing={2}>
      {previewImages.map((image, index) => (
        <Badge
          overlap='circular'
          key={index}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <SmallAvatar>
              {isSubmitting ? (
                <RemoveCircleIcon />
              ) : (
                <Link
                  href='#'
                  onClick={(e) => handleRemove(e, index)}
                  underline='none'
                >
                  <RemoveCircleIcon color='error' />
                </Link>
              )}
            </SmallAvatar>
          }
        >
          <Avatar
            sx={{
              width: { sm: 50, md: 100, lg: 150 },
              height: { sm: 50, md: 100, lg: 150 },
            }}
            alt={`Image number #${index}`}
            src={image.url}
            onClick={(e) => handleImage(e, image.url, image.key)}
          />
        </Badge>
      ))}
    </Stack>
  );
}
