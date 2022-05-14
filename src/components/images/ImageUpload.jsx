import ImageCropper from '@/components/images/ImageCropper';
import getCroppedImg from '@/utils/imageCrop';
import { Box, Button } from '@mui/material';
import Resizer from 'react-image-file-resizer';
import React from 'react';

function ImageUpload({
  state,
  setState,
  photoURL,
  setPhotoURL,
  setOpenCrop,
  openCrop,
}) {
  const { images, previewImages } = state;

  const handleImage = (event) => {
    let fileInput = false;
    let files = event.target.files;
    if (event.target.files[0]) {
      fileInput = true;
    }

    if (fileInput && images.length < 5) {
      for (let i = 0; i < files.length; i++) {
        let file = files[i];

        try {
          setOpenCrop(true);

          return setPhotoURL(URL.createObjectURL(file));
        } catch (err) {
          console.log(err);
          setState({
            ...state,
            snack: {
              message: 'Upload failed',
              duration: 3000,
              type: 'error',
              open: true,
            },
          });
        }
      }
    }
  };

  const cropImage = async ({ photoURL, croppedAreaPixels, rotation }) => {
    try {
      const { file, url } = await getCroppedImg(
        photoURL,
        croppedAreaPixels,
        rotation
      );

      Resizer.imageFileResizer(
        file,
        1080,
        1080,
        'JPEG',
        100,
        0,
        (uri) => {
          if (images.length < 3) {
            let newPreview = [];
            newPreview = previewImages;
            newPreview.push({ uri, url: URL.createObjectURL(file) });

            let newImages = [];
            newImages = images;
            // const newFile = new File([uri], uri, {
            //   type: 'image/jpeg',
            // });
            newImages.push(uri);

            setState({
              ...state,
              images: newImages,
              previewImages: newPreview,
            });
          } else {
            setState({
              ...state,
              snack: {
                type: 'error',
                duration: 4000,
                open: true,
                message: 'Maximum uploads reached',
              },
            });
          }

          return setOpenCrop(false);
        },
        'base64',
        720,
        720
      );
    } catch (err) {
      console.log(err);
      setState({
        ...state,
        snack: {
          type: 'error',
          duration: 4000,
          open: true,
          message: 'Upload failed',
        },
      });
    }
  };

  return (
    <>
      <input
        type='file'
        accept='image/*'
        className='form-control'
        hidden
        onChange={handleImage}
        required
        disabled={images.length >= 3}
        style={{ display: 'none' }}
        id='raised-button-file'
      />
      <label htmlFor='raised-button-file'>
        <Button variant='text' component='span' disabled={images.length >= 3}>
          {images.length >= 3 ? 'Maximum Uploads Reached' : 'Add Images'}
        </Button>
      </label>
      <ImageCropper
        {...{
          photoURL,
          setOpenCrop,
          openCrop,
          title: 'Upload Product',
          handleImage,
          cropImage,
          state: state,
          setState: setState,
        }}
      />
    </>
  );
}

export default ImageUpload;
