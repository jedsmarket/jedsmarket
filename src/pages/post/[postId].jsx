import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Divider, Grid, Typography } from '@mui/material';
import SEO from '@/components/nav/SEO';
import Loading from '@/components/ui/Loading';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase/firebase-config';
import { SnackContext } from '@/utils/globalContext';
import ImageCarousel from '@/components/images/Carousel';
import CurrencyFormat from 'react-currency-format';

function PostView() {
  const [state, setState] = useState({
    loading: true,
    post: {},
    postedBy: {},
  });

  const snackContext = useContext(SnackContext);

  const { setSnack } = snackContext;

  const { loading, post, postedBy } = state;
  const { title, description, price, specifications } = post;
  const router = useRouter();

  useEffect(async () => {
    const postId = router.query.postId;

    if (postId) {
      console.log(postId);

      const docRef = doc(db, 'posts', postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // console.log('Document data:', docSnap.data());

        let postData = docSnap.data();

        const posterRef = doc(db, 'users', postData.postedBy);
        const posterSnap = await getDoc(posterRef);

        if (posterSnap.exists()) {
          // console.log('Document data:', posterSnap.data());

          setState({
            ...state,
            loading: false,
            post: postData,
            postedBy: posterSnap.data(),
          });
        } else {
          // doc.data() will be undefined in this case
          console.log('No such document!');
          setSnack({
            open: true,
            message: 'This post user no longer has an account',
            type: 'info',
            duration: 3000,
          });

          // router.push('/');
        }
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!');
        setSnack({
          open: true,
          message: 'This post was deleted or does not exist',
          type: 'info',
          duration: 3000,
        });
        router.push('/');
      }
    }
  }, [router]);

  if (loading) return <Loading />;
  return (
    <Box>
      <SEO
        title={post.title}
        description={post.description}
        image={post.images[0].url}
      />
      <Grid container justifyContent={'center'}>
        <Grid item xs={11} sm={10} md={9} my={3}>
          <Typography variant='h4' fullWidth align='center'>
            {post.title}
          </Typography>
        </Grid>
        <Grid item xs={11} sm={10} md={9} my={3}>
          <Box>
            <ImageCarousel images={post.images} />
          </Box>
        </Grid>

        <Grid item xs={11} sm={10} md={9}>
          <Divider textAlign='left'>
            <Typography variant='h4'>Details</Typography>
          </Divider>
        </Grid>

        <Grid item xs={11} sm={10} md={9} my={3}>
          {price !== null && (
            <>
              <Typography variant='h6' fullWidth>
                Price
              </Typography>
              <Typography variant='body1' pl={1} mb={2} fullWidth>
                <CurrencyFormat
                  displayType='text'
                  value={price}
                  decimalScale={2}
                  fixedDecimalScale={true}
                  thousandSeparator={true}
                  prefix='N$'
                />
              </Typography>
            </>
          )}
          <Typography variant='h6' fullWidth>
            Description
          </Typography>
          <Typography variant='body1' mb={2} pl={1} fullWidth>
            {description}
          </Typography>

          {specifications !== null && (
            <>
              <Typography variant='h6' fullWidth>
                Specifications
              </Typography>
              <ul>
                {specifications.map((s) => (
                  <li key={s}>
                    <Typography variant='body1' fullWidth>
                      {s}
                    </Typography>
                  </li>
                ))}
              </ul>
            </>
          )}

          <Typography variant='h6' fullWidth>
            Contact Details
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', pl: 2 }}>
            <Typography variant='body1' fullWidth>
              {postedBy.name !== null && postedBy.name !== undefined && (
                <Typography variant='body1' fullWidth>
                  <b>Name:</b> {postedBy.name}
                </Typography>
              )}
              <b>Email:</b> {postedBy.email}
            </Typography>
            {postedBy.phoneNumber !== null &&
              postedBy.phoneNumber !== undefined && (
                <Typography variant='body1' fullWidth>
                  <b>Mobile:</b> {postedBy.phoneNumber}
                </Typography>
              )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PostView;
