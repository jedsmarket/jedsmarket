import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { ShoppingCart } from '@mui/icons-material';
import { Box, styled, Tooltip } from '@mui/material';
import CurrencyFormat from 'react-currency-format';
import Link from '../nav/Link';

// ------
const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

export default function PostCard({ post }) {
  return (
    <Link href={`/post/${post.id}`} underline='none'>
      <Card
        sx={{
          maxWidth: 345,
          boxShadow: 4,
          transition: 'transform 0.15s ease-in-out',
          '&:hover': {
            transform: 'scale3d(1.02, 1.02, 1)',
          },
        }}
      >
        <Box sx={{ pt: '100%', position: 'relative' }}>
          <ProductImgStyle alt={post.title} src={post.images[0].url} />
        </Box>
        <CardContent>
          <Typography gutterBottom variant='body1' component='div'>
            {post.title}
          </Typography>
          <Typography gutterBottom variant='body2' component='span'>
            {post.price ? (
              <CurrencyFormat
                displayType='text'
                value={post?.price}
                decimalScale={2}
                fixedDecimalScale={true}
                thousandSeparator={true}
                prefix='N$'
              />
            ) : (
              post.description.substring(0, 30)
            )}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
