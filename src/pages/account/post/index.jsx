import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';
import SEO from '@/components/nav/SEO';
import { SnackContext, UserContext } from '@/utils/globalContext';
import { useRouter } from 'next/router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, storage } from '@/utils/firebase/firebase-config';
import ImageUpload from '@/components/images/ImageUpload';
import ImagePreview from '@/components/images/ImagePreview';
import Loading from '@/components/ui/Loading';
import DeleteIcon from '@mui/icons-material/Delete';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { styled } from '@mui/material/styles';

import slugify from 'slugify';
import Link from '@/components/nav/Link';
const { v4: uuidv4 } = require('uuid');

function CreatePost() {
  const [state, setState] = useState({
    title: '',
    description: '',
    price: null,
    specifications: null,
    postedBy: '',
    images: [],
    previewImages: [],
    isSubmitting: false,
    loading: true,
    specs: false,
    setPrice: false,
  });
  const [openCrop, setOpenCrop] = useState(false);
  const [photoURL, setPhotoURL] = useState('');

  const {
    title,
    description,
    price,
    specifications,
    postedBy,
    isSubmitting,
    images,
    loading,
    specs,
    setPrice,
  } = state;

  const snackContext = useContext(SnackContext);

  const { setSnack } = snackContext;

  const router = useRouter();

  const userContext = useContext(UserContext);

  const { currentUser } = userContext;

  useEffect(() => {
    if (currentUser && currentUser !== null) {
      // console.log(currentUser);
      if (db !== undefined) {
        fetchUserData();
      }
    } else {
      const delayed = () =>
        setTimeout(() => {
          if (currentUser && currentUser !== null) {
            setSnack({
              message: 'Please log in to post',
              open: true,
              duration: 3000,
              type: 'info',
            });
            router.push('/auth/login');
          } else {
            return;
          }
        }, 3000);

      return () => {
        clearTimeout(delayed);
      };
    }
  }, [currentUser, db]);

  const fetchUserData = async () => {
    setState({ ...state, loading: true });
    try {
      const docRef = doc(db, 'users', currentUser.email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setState({ ...state, loading: false, postedBy: docSnap.data().email });
      } else {
        // doc.data() will be undefined in this case
        const message = 'Error retrieving user data. Please refresh your page.';
        console.log(message);
        setState({
          ...state,
          loading: false,
        });
        // setSnack({ duration: 4000, type: 'error', message, open: true });

        setSnack({
          duration: 4000,
          type: 'info',
          message: 'You need to be logged in to create a post.',
          open: true,
        });
        
        router.push('/auth/login');
      }
    } catch {
      setState({
        ...state,
      });
      setSnack({
        duration: 4000,
        type: 'error',
        message: 'Server offline',
        open: true,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title === '') {
      return setSnack({
        duration: 3000,
        type: 'error',
        open: true,
        message: 'Please enter a title',
      });
    }

    if (description === '') {
      return setSnack({
        duration: 3000,
        type: 'error',
        open: true,
        message: 'Please enter a description',
      });
    }

    if (images.length < 1) {
      return setSnack({
        duration: 3000,
        type: 'error',
        open: true,
        message: 'Please upload at least 1 image',
      });
    }

    if (setPrice === true && price < 1) {
      return setSnack({
        duration: 3000,
        type: 'error',
        open: true,
        message: 'Please enter a valid price or remove price',
      });
    }

    if (specifications.length > 0) {
      setState({
        ...state,
        loading: true,
        specifications: specifications
          .map((s) => s.trim())
          .filter((s) => s !== ''),
      });
    } else {
      setState({ ...state, specifications: null });
    }

    let uploadedImages = [];
    images.map((file, fIndex) => {
      const nameSlug = slugify(`${title}-${uuidv4().substring(0, 6)}`);
      const storageRef = ref(storage, `posts/${nameSlug}-${fIndex}.jpeg`);

      // 'file' comes from the Blob or File API
      uploadString(storageRef, file.substring(23), 'base64', {
        contentType: 'image/jpeg',
      })
        .then((snapshot) => {
          console.log('Blob:', snapshot);
          console.log('Uploaded a blob or file!');

          getDownloadURL(ref(storage, snapshot.ref.fullPath))
            .then((url) => {
              console.log('Image url', url);
              uploadedImages.push({ ref: snapshot.ref.fullPath, url });

              if (fIndex === images.length - 1) {
                try {
                  const docRef = doc(db, 'posts', `${nameSlug}`);
                  setDoc(docRef, {
                    title,
                    description,
                    price,
                    images: uploadedImages,
                    specifications,
                    postedBy,
                  });

                  console.log('Document written with ID: ', docRef.id);
                  console.log('Document info: ', docRef);

                  if (docRef) {
                    setSnack({
                      duration: 3000,
                      type: 'success',
                      open: true,
                      message: 'Post created successfully!',
                    });
                    window.location.reload();
                  }
                } catch (error) {
                  console.log(error);
                  setSnack({
                    duration: 3000,
                    type: 'error',
                    open: true,
                    message: 'An error occurred',
                  });
                }
              }
            })
            .catch((error) => {
              // Handle any errors
              console.log(error);
            });
        })
        .catch((err) => {
          console.log(err);
          setSnack({
            duration: 3000,
            type: 'error',
            message: 'Some images could not be uploaded',
            open: true,
          });
        });
    });
  };

  const handleChange = (e) => {
    if (e.target.name === 'specifications') {
      setState({
        ...state,
        [e.target.name]: e.target.value.split(','),
      });
    } else {
      setState({ ...state, [e.target.name]: e.target.value });
    }
  };

  if (loading) return <Loading />;

  return (
    <Box sx={{ minHeight: '85vh' }}>
      <SEO
        title='Create a Post | JEDS Market'
        description='Create a new post on JEDS Market'
      />
      <Grid container justifyContent={'center'} py={4}>
        <Grid item xs={11} my={3}>
          <Typography variant='h4' align='center'>
            Create a Post
          </Typography>
        </Grid>
        <Grid item xs={11} sm={10} md={9} lg={8}>
          <form onSubmit={handleSubmit} noValidate>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel htmlFor='outlined-adornment-title-createPost'>
                Title
              </InputLabel>
              <OutlinedInput
                id='outlined-adornment-title-createPost'
                type='text'
                value={title}
                name='title'
                onChange={handleChange}
                label='Title'
                inputProps={{}}
              />

              <FormHelperText id='standard-weight-helper-text-title-createPost'>
                The title/name of your post
              </FormHelperText>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel htmlFor='outlined-adornment-description-createPost'>
                Description
              </InputLabel>
              <OutlinedInput
                id='outlined-adornment-description-createPost'
                type='text'
                value={description}
                name='description'
                onChange={handleChange}
                rows={4}
                multiline
                label='Description'
                inputProps={{}}
              />

              <FormHelperText id='standard-weight-helper-text-description-createPost'>
                Please provide a description of your post
              </FormHelperText>
            </FormControl>

            <Box sx={{ width: '100%', mt: 2, mb: 1 }}>
              {specs ? (
                <Link
                  href={'#'}
                  underline='none'
                  onClick={(e) => {
                    e.preventDefault();
                    setState({ ...state, specs: false, specifications: null });
                  }}
                >
                  Remove Specifications
                </Link>
              ) : (
                <Link
                  href={'#'}
                  underline='none'
                  onClick={(e) => {
                    e.preventDefault();
                    setState({ ...state, specs: true, specifications: [] });
                  }}
                >
                  Add Specifications
                </Link>
              )}
            </Box>

            {specs && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel htmlFor='outlined-adornment-specifications-createPost'>
                  Specifications
                </InputLabel>
                <OutlinedInput
                  id='outlined-adornment-specifications-createPost'
                  type='text'
                  value={specifications}
                  name='specifications'
                  onChange={handleChange}
                  label='Specifications'
                  inputProps={{}}
                />

                <FormHelperText id='standard-weight-helper-text-specifications-createPost'>
                  Please enter the specifications separated by commas, e.g:
                  Black, Small, Delivery included
                </FormHelperText>
              </FormControl>
            )}
            {specs && (
              <Box sx={{ width: '100%' }}>
                {specifications.map((s, index) => {
                  return (
                    <Chip
                      label={s}
                      key={index}
                      sx={{ mr: 1 }}
                      onDelete={(e) => {
                        const newSpecs = [...specifications];
                        const removed = newSpecs.splice(index, 1);
                        setState({
                          ...state,
                          specifications: newSpecs,
                        });
                      }}
                      deleteIcon={<DeleteIcon />}
                      variant='outlined'
                    />
                  );
                })}
              </Box>
            )}

            <Box sx={{ width: '100%', mt: 2, mb: 1 }}>
              {setPrice ? (
                <Link
                  href={'#'}
                  underline='none'
                  onClick={(e) => {
                    e.preventDefault();
                    setState({ ...state, setPrice: false, price: null });
                  }}
                >
                  Remove Price
                </Link>
              ) : (
                <Link
                  href={'#'}
                  underline='none'
                  onClick={(e) => {
                    e.preventDefault();
                    setState({ ...state, setPrice: true, price: 1 });
                  }}
                >
                  Set Price
                </Link>
              )}
            </Box>

            {setPrice && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel htmlFor='outlined-adornment-price-createPost'>
                  Price
                </InputLabel>
                <OutlinedInput
                  id='outlined-adornment-price-createPost'
                  type='number'
                  value={price}
                  name='price'
                  onChange={handleChange}
                  label='Price'
                  inputProps={{}}
                />

                <FormHelperText id='standard-weight-helper-text-price-createPost'>
                  If your post has a price, please add one
                </FormHelperText>
              </FormControl>
            )}

            <Box sx={{ width: '100%' }}>
              <Grid item xs={11} sm={10} md={9} lg={8} my={2}>
                <ImageUpload
                  state={state}
                  setState={setState}
                  photoURL={photoURL}
                  setPhotoURL={setPhotoURL}
                  setOpenCrop={setOpenCrop}
                  openCrop={openCrop}
                />
              </Grid>
              <Grid item xs={11} sm={10} md={9} lg={8} my={2}>
                <ImagePreview
                  setOpenCrop={setOpenCrop}
                  setPhotoURL={setPhotoURL}
                  state={state}
                  setState={setState}
                  isSubmitting={isSubmitting}
                />
              </Grid>
            </Box>

            <Button type='submit' variant='contained' fullWidth>
              {loading ? (
                <>
                  <CircularProgress color='inherit' size={20} />
                  <Typography variant='span' ml={1}>
                    Loading...
                  </Typography>
                </>
              ) : (
                'Post'
              )}
            </Button>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CreatePost;
