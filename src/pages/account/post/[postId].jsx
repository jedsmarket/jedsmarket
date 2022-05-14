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
import DeleteIcon from '@mui/icons-material/Delete';

import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { SnackContext, UserContext } from '@/utils/globalContext';
import { useRouter } from 'next/router';
import { db } from '@/utils/firebase/firebase-config';
import SEO from '@/components/nav/SEO';
import Loading from '@/components/ui/Loading';
import Link from '@/components/nav/Link';

function PostEdit() {
  const [state, setState] = useState({
    post: {},
    newPost: { title: '', description: '', specifications: null, price: null },
    loading: true,
    setSpecs: false,
    setPrice: false,
  });

  const { loading, post, newPost, setPrice, setSpecs } = state;

  const snackContext = useContext(SnackContext);

  const { setSnack } = snackContext;

  const router = useRouter();

  const userContext = useContext(UserContext);

  const { currentUser } = userContext;

  useEffect(() => {
    const postId = router.query.postId;
    if (currentUser && currentUser !== null) {
      if (db !== undefined) {
        fetchPost(postId);
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
  }, [currentUser, router, db]);

  const fetchPost = async (postId) => {
    setState({ ...state, loading: true });
    try {
      const docRef = doc(db, 'posts', postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const docData = docSnap.data();
        let newPost = {
          title: docData.title,
          description: docData.description,
        };
        let setSpecs = false;
        let setPrice = false;

        if (docData.specifications === null) {
          newPost.specifications = null;
        } else {
          newPost.specifications = [];
          newPost.specifications = docData.specifications;
          setSpecs = true;
        }

        if (docData.price === null) {
          newPost.price = null;
        } else {
          newPost.price = docData.price;
          setPrice = true;
        }

        if (docData.postedBy === currentUser.email) {
          setState({
            ...state,
            loading: false,
            post: docData,
            newPost,
            setPrice,
            setSpecs,
          });
        } else {
          router.push('/account');

          setSnack({
            duration: 4000,
            type: 'info',
            message: 'You can only edit your own posts.',
            open: true,
          });
        }
      } else {
        // doc.data() will be undefined in this case
        const message = 'Error retrieving post data';
        console.log(message);
        setState({
          ...state,
          loading: false,
        });
        // setSnack({ duration: 4000, type: 'error', message, open: true });

        setSnack({
          duration: 4000,
          type: 'info',
          message: 'This post does not exist.',
          open: true,
        });
        router.push('/account');
      }
    } catch {
      setState({
        ...state,
        loading: false,
      });
      setSnack({
        duration: 4000,
        type: 'error',
        message: 'Server offline. Please refresh',
        open: true,
      });
    }
  };

  const handleSubmit = async (e) => {
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

    if (setPrice === true && price < 1) {
      return setSnack({
        duration: 3000,
        type: 'error',
        open: true,
        message: 'Please enter a valid price or remove price',
      });
    }

    if (setPrice === false) {
      setState({ ...state, newPost: { ...newPost, price: null } });
    }

    if (specifications.length > 0) {
      setState({
        ...state,
        loading: true,
        newPost: {
          ...newPost,
          specifications: specifications
            .map((s) => s.trim())
            .filter((s) => s !== ''),
        },
      });
    } else {
      setState({ ...state, newPost: { ...newPost, specifications: null } });
    }

    try {
      const docRef = doc(db, 'posts', router.query.postId);
      await updateDoc(docRef, {
        title,
        description,
        price,
        specifications,
      });

      if (docRef) {
        setSnack({
          duration: 3000,
          type: 'success',
          open: true,
          message: 'Post updated successfully!',
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
  };

  const handleChange = (e) => {
    if (e.target.name === 'specifications') {
      setState({
        ...state,
        newPost: {
          ...state.newPost,
          [e.target.name]: e.target.value.split(','),
        },
      });
    } else {
      setState({
        ...state,
        newPost: { ...state.newPost, [e.target.name]: e.target.value },
      });
    }
  };

  const { title, description, specifications, price } = newPost;

  if (loading) return <Loading />;

  return (
    <Box>
      <SEO
        title={`Update ${post.title}`}
        description={`Update the properties of the ${post.title} post`}
        image={post && post.images && post.images[0].url}
      />
      <Grid container justifyContent={'center'} py={4}>
        <Grid item xs={11} my={3}>
          <Typography variant='h4' align='center'>
            Update {post.title}
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
              {setSpecs ? (
                <Link
                  href={'#'}
                  underline='none'
                  onClick={(e) => {
                    e.preventDefault();
                    setState({
                      ...state,
                      setSpecs: false,
                      specifications: null,
                    });
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
                    setState({ ...state, setSpecs: true, specifications: [] });
                  }}
                >
                  Add Specifications
                </Link>
              )}
            </Box>

            {setSpecs && (
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
            {setSpecs && (
              <Box sx={{ width: '100%' }}>
                {specifications &&
                  specifications.map((s, index) => {
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
              <Typography
                component={Link}
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  fetchPost(router.query.postId);
                }}
              >
                Reset
              </Typography>
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
                'Update'
              )}
            </Button>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PostEdit;
