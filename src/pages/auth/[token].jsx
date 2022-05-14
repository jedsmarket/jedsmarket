import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import { Box, Grid } from '@mui/material';
import { auth, db } from '@/utils/firebase/firebase-config';
import { doc, setDoc } from 'firebase/firestore';
import {
  signInWithEmailLink,
  updatePassword,
  updateProfile,
} from 'firebase/auth';
import Loading from '@/components/ui/Loading';
import SEO from '@/components/nav/SEO';
import { SnackContext } from '@/utils/globalContext';

function RegisterComplete() {
  const [state, setState] = useState({
    loading: true,
  });
  const router = useRouter();

  const snackContext = useContext(SnackContext);

  const { setSnack } = snackContext;

  useEffect(() => {
    const { token } = router.query;
    if (token) {
      jwt.verify(
        token,
        process.env.NEXT_PUBLIC_JWT_REGISTER,
        async function (err, decoded) {
          if (err) {
            console.log(err);
            setSnack({
              duration: 4000,
              type: 'error',
              open: true,
              message: 'Invalid/expired link. Please register again.',
            });
            router.push('/auth/register');
          }

          const { email, name, phoneNumber, password } = decoded;

          auth.signOut(auth);
          signInWithEmailLink(auth, email, window.location.href)
            .then((result) => {
              let user = result.user;

              updatePassword(user, password)
                .then(() => {
                  updateProfile(user, {
                    displayName: name,
                    phoneNumber,
                    emailVerified: true,
                  })
                    .then(() => {
                      try {
                        const docRef = doc(db, 'users', email);
                        setDoc(docRef, {
                          uid: user.uid,
                          name,
                          phoneNumber,
                          email,
                        });

                        console.log('Document written with ID: ', docRef.id);
                        console.log('Document info: ', docRef);

                        setSnack({
                          duration: 4000,
                          type: 'success',
                          open: true,
                          message: 'Account activated successfully!',
                        });
                        router.push('/account');
                      } catch (e) {
                        console.error('Error adding document: ', e);
                        setState({
                          ...state,
                          loading: false,
                        });
                        setSnack({
                          duration: 4000,
                          type: 'error',
                          open: true,
                          message:
                            'Error creating account. Please register again.',
                        });
                        router.push('/auth/register');
                      }
                    })
                    .catch((err) => {
                      console.log('Profile update error', err);
                    });
                })
                .catch((err) => {
                  console.log('Password update error', err);
                });
            })
            .catch((err) => {
              console.log('Sign in error', err);
            });
        }
      );
    }
  }, [router]);

  return (
    <Box>
      <SEO title='Activating Account | JEDS Market' robots={false} />
      <Grid container justifyContent='center'>
        <Grid item xs={11}>
          <Loading />
        </Grid>
      </Grid>
    </Box>
  );
}

export default RegisterComplete;
