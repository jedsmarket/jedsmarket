import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { AccountCircle } from '@mui/icons-material';
import Link from './Link';
import { auth } from '@/utils/firebase/firebase-config';
import { UserContext } from '@/utils/globalContext';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const userContext = React.useContext(UserContext);

  const { currentUser, setCurrentUser } = userContext;

  const router = useRouter();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setAnchorElUser(null);
    setCurrentUser(null);
    router.push('/');
  };

  return (
    <AppBar position='static'>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Link href='/' underline='none' color='inherit'>
            <Typography
              variant='h6'
              noWrap
              component='div'
              sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
            >
              JEDS Market
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {' '}
              <MenuItem onClick={handleCloseNavMenu}>
                <Link href='/account/post' underline='none' color='inherit'>
                  <Typography textAlign='center'>Post</Typography>
                </Link>{' '}
              </MenuItem>
            </Menu>
          </Box>
          <Link href='/' underline='none' color='inherit'>
            <Typography
              variant='h6'
              noWrap
              component='div'
              sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
            >
              JEDS Market
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              onClick={(e) => {
                handleCloseNavMenu(e);
                router.push('/account/post');
              }}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              Post
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {currentUser && currentUser !== null && (
              <Typography
                component={Link}
                color='inherit'
                underline='none'
                href='/account'
                mr={1}
              >
                Dashboard
              </Typography>
            )}
            <Tooltip title='Open account settings'>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: '#212121' }}>
                  <AccountCircle />
                </Avatar>
              </IconButton>
            </Tooltip>

            {currentUser?.email ? (
              <Menu
                sx={{ mt: '45px' }}
                id='menu-appbar'
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign='center'>
                    Hello,{' '}
                    {currentUser.displayName
                      ? currentUser.displayName
                      : currentUser.email}
                  </Typography>
                </MenuItem>
                <Link href='/account' underline='none' color='inherit'>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign='center'>Account</Typography>
                  </MenuItem>
                </Link>
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign='center'>Logout</Typography>
                </MenuItem>
              </Menu>
            ) : (
              <Menu
                sx={{ mt: '45px' }}
                id='menu-appbar'
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography
                    component={Link}
                    underline='none'
                    color='inherit'
                    href='/auth/login'
                    textAlign='center'
                  >
                    Login
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography
                    component={Link}
                    underline='none'
                    color='inherit'
                    href='/auth/register'
                    textAlign='center'
                  >
                    Register
                  </Typography>
                </MenuItem>
              </Menu>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
