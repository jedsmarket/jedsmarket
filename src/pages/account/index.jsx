import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Divider,
  OutlinedInput,
  TextField,
  FormControl,
  InputLabel,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import SEO from '@/components/nav/SEO';
import { SnackContext, UserContext } from '@/utils/globalContext';
import { useRouter } from 'next/router';

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db, storage } from '@/utils/firebase/firebase-config';
import Loading from '@/components/ui/Loading';
import { updateProfile } from 'firebase/auth';
import Link from '@/components/nav/Link';
import { deleteObject, ref } from 'firebase/storage';

const validPhoneNumber = new RegExp(`^[0-9]{10}$`);

function Account() {
  const [state, setState] = useState({
    user: {},
    editName: '',
    editPhoneNumber: '',
    myPosts: [],
    editingSettings: false,
    submittingUserEdit: false,
    loading: true,
  });

  const snackContext = useContext(SnackContext);

  const { setSnack } = snackContext;

  const {
    user,
    editName,
    editPhoneNumber,
    myPosts,
    loading,
    editingSettings,
    submittingUserEdit,
  } = state;

  const userContext = useContext(UserContext);

  const { currentUser } = userContext;

  const router = useRouter();

  useEffect(() => {
    if (currentUser && currentUser.email) {
      fetchUserData();
    } else {
      return router.push('/');
      const delayed = () =>
        setTimeout(() => {
          if (currentUser && currentUser !== null) {
            return;
          } else {
            router.push('/');
          }
        }, 3000);

      return () => {
        clearTimeout(delayed);
      };
    }
  }, [currentUser, db]);

  const fetchUserData = async () => {
    const docRef = doc(db, 'users', currentUser.email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      //

      let myPosts = [];

      const q = query(
        collection(db, 'posts'),
        where('postedBy', '==', currentUser.email)
      );
      const posts = await getDocs(q);
      posts.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, ' => ', doc.data());
        let docData = doc.data();
        docData.id = doc.id;
        myPosts.push(docData);
      });

      setState({
        ...state,
        loading: false,
        editingSettings: false,
        user: docSnap.data(),
        editName: docSnap.data().name,
        editPhoneNumber: docSnap.data().phoneNumber,
        myPosts,
      });

      //
    } else {
      // doc.data() will be undefined in this case
      const message = 'Error retrieving user data. Please refresh';
      console.log(message);
      setState({
        ...state,
      });
      setSnack({ duration: 4000, type: 'error', message, open: true });
    }
  };

  const handleChange = (e) => {
    const key = e.target.name;
    const value = e.target.value;

    if (key === 'editPhoneNumber') {
      if (value.length <= 10) {
        setState({ ...state, [key]: value });
      } else {
        setState({
          ...state,
        });
        setSnack({
          duration: 4000,
          type: 'info',
          message: 'Please enter only 10 digits',
          open: true,
        });
      }
    } else {
      setState({
        ...state,
        [key]: value,
      });
      setSnack({ duration: 4000, type: 'info', message: '', open: false });
    }
  };

  const handleUserEdit = (e) => {
    e.preventDefault();
    if (editName.length < 3) {
      setSnack({
        duration: 4000,
        type: 'error',
        message: 'Name too short',
        open: true,
      });
    }

    if (!validPhoneNumber.test(editPhoneNumber)) {
      setSnack({
        duration: 4000,
        type: 'error',
        message: 'Phone number invalid',
        open: true,
      });
    }

    updateUser();
  };

  const updateUser = async () => {
    setState({
      ...state,

      submittingUserEdit: true,
    });
    setSnack({
      duration: 4000,
      type: 'success',
      message: '',
      open: false,
    });

    const user = auth.currentUser;
    updateProfile(user, {
      displayName: editName,
      phoneNumber: editPhoneNumber,
    })
      .then(async () => {
        try {
          const docRef = doc(db, 'users', currentUser.email);
          const updated = await updateDoc(docRef, {
            name: editName,
            phoneNumber: editPhoneNumber,
          });

          console.log('Updated', updated);
          fetchUserData();
        } catch (err) {
          console.log(err);
          setState({
            ...state,
            submittingUserEdit: false,
          });
          setSnack({
            duration: 4000,
            type: 'error',
            message: 'Failed to update',
            open: true,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setState({
          ...state,
          submittingUserEdit: false,
        });
        setSnack({
          duration: 4000,
          open: true,
          type: 'error',
          message: 'Failed to update',
        });
      });
  };

  const handleDeletePost = ({ e, postRef, images }) => {
    e.preventDefault();
    setState({ ...state, loading: true });
    images.forEach((i, imageIndex) => {
      const deleteImageRef = ref(storage, i.ref);

      deleteObject(deleteImageRef)
        .then(async () => {
          if (imageIndex === images.length - 1) {
            try {
              await deleteDoc(doc(db, 'posts', postRef));
              setSnack({
                duration: 4000,
                open: true,
                type: 'success',
                message: 'Post deleted',
              });
              window.location.reload();
            } catch (error) {
              setState({ ...state, loading: false });
              setSnack({
                duration: 3000,
                open: true,
                type: 'error',
                message: 'An error occurred',
              });
            }
          }
        })
        .catch((error) => {
          setSnack({
            duration: 4000,
            open: true,
            type: 'error',
            message: 'Some images could not be deleted',
          });
        });
    });
  };

  return (
    <Box>
      <SEO
        title='My Account | JEDS Market'
        description='My JEDS Market account page'
      />
      <Grid justifyContent='center' container>
        <Grid item xs={11} sm={10} md={9} lg={8} container>
          <Grid item xs={12} my={4}>
            <Typography variant='h4' align='center'>
              My Account
            </Typography>
          </Grid>
          {loading ? (
            <Loading />
          ) : (
            <>
              <Grid item xs={12} md={5}>
                <Divider textAlign='left'>Settings</Divider>
                <Box sx={{ minWidth: '100%', boxShadow: 1, p: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <IconButton
                      onClick={(e) => {
                        e.preventDefault();
                        setState({
                          ...state,
                          editingSettings: !editingSettings,
                        });
                      }}
                    >
                      <Avatar
                        sx={{ bgcolor: '#212121', height: 32, width: 32 }}
                        variant='rounded'
                      >
                        <EditIcon />
                      </Avatar>
                    </IconButton>
                  </Box>
                  {editingSettings ? (
                    <form onSubmit={handleUserEdit}>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel htmlFor='outlined-adornment-name-account'>
                          Name
                        </InputLabel>
                        <OutlinedInput
                          id='outlined-adornment-name-account'
                          type='text'
                          value={editName}
                          name='editName'
                          onChange={handleChange}
                          label='Name'
                          inputProps={{}}
                        />
                      </FormControl>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel htmlFor='outlined-adornment-editPhoneNumber-account'>
                          Phone Number
                        </InputLabel>
                        <OutlinedInput
                          id='outlined-adornment-editPhoneNumber-account'
                          type='text'
                          value={editPhoneNumber}
                          name='editPhoneNumber'
                          onChange={handleChange}
                          label='Phone Number'
                          inputProps={{}}
                        />
                      </FormControl>
                      <Button
                        variant='contained'
                        type='submit'
                        fullWidth
                        disabled={submittingUserEdit}
                      >
                        {submittingUserEdit ? (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CircularProgress color='inherit' size={20} />
                            <Typography variant='span' ml={1}>
                              Loading
                            </Typography>
                          </Box>
                        ) : (
                          'Submit'
                        )}
                      </Button>
                    </form>
                  ) : (
                    <List sx={{ width: '100%' }}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: '#212121' }}>
                            <AccountCircleIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={user.name} />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: '#212121' }}>
                            <EmailIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={user.email} />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: '#212121' }}>
                            <LocalPhoneIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.phoneNumber ? user.phoneNumber : 'N/A'}
                        />
                      </ListItem>
                    </List>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={6} container justifyContent={'center'}>
                <Grid item xs={12}>
                  <Divider textAlign='left'>My Posts</Divider>
                </Grid>
                <Grid item xs={12} mx={1}>
                  {myPosts.length >= 1 ? (
                    myPosts.map((p) => (
                      <Box
                        sx={{
                          width: '100%',
                          boxShadow: 2,
                          p: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography>{p.title}</Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            spacing: 1,
                          }}
                        >
                          <Tooltip title={`Edit ${p.title}`}>
                            <IconButton
                              onClick={(e) =>
                                router.push(`/account/post/${p.id}`)
                              }
                            >
                              <Avatar
                                sx={{
                                  bgcolor: '#212121',
                                  height: 32,
                                  width: 32,
                                }}
                                variant='rounded'
                              >
                                <EditIcon />
                              </Avatar>
                            </IconButton>
                          </Tooltip>

                          <Tooltip title={`Delete ${p.title}`}>
                            <IconButton
                              onClick={(e) =>
                                handleDeletePost({
                                  e,
                                  postRef: p.id,
                                  images: p.images,
                                })
                              }
                            >
                              <Avatar
                                sx={{
                                  bgcolor: '#212121',
                                  height: 32,
                                  width: 32,
                                }}
                                variant='rounded'
                              >
                                <DeleteIcon />
                              </Avatar>
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Box sx={{ width: '100%' }}>
                      <Typography variant='body1' fullWidth align='center'>
                        You have not posted anything yet.
                        <br />
                        <Link href='/account/post'>Post on Jeds Market</Link>
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default Account;
