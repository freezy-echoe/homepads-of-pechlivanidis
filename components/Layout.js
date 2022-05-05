import Head from 'next/head';
import { CssBaseline, ThemeProvider } from '@mui/material';

import { createTheme } from '@mui/material/styles';

import React, { useEffect, useContext, useState } from 'react';

import { useRouter } from 'next/router';
import classes from '../utils/classes';
//import { getError } from '../utils/error';
import Cookies from 'js-cookie';
//import { useSnackbar } from 'notistack';
import NextLink from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Link,
  Switch,
  Button,
  Menu,
  MenuItem,
  Box,
  Badge,
} from '@mui/material';

import { Store } from '../utils/Store';

export default function Layout({ description, title, children }) {
  const router = useRouter();

  const { state, dispatch } = useContext(Store);
  const { darkMode, cart, userInfo } = state;
  const theme = createTheme({
    components: {
      MuiLink: {
        defaultProps: {
          underline: 'hover',
        },
      },
    },

    typography: {
      h1: {
        fontSize: '1.6rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
      h2: {
        fontSize: '1.4rem',
        fontWeight: 400,
        margin: '1rem 0',
      },
    },
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#f0c000',
      },
      secondary: {
        main: '#208080',
      },
    },
  });
  //const router = useRouter();

  const [darkModeState, setDarkModeState] = useState(false);
  useEffect(() => {
    setDarkModeState(darkMode);
  }, [darkMode]);
  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newDarkMode = !darkMode;
    setDarkModeState(newDarkMode);
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const loginMenuCloseHandler = () => {
    setAnchorEl(null);
  };
  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: 'USER_LOGOUT' });
    Cookies.remove('userInfo');
    Cookies.remove('cartItems');
    router.push('/');
  };
  return (
    <div>
      <Head>
        <title>
          {title
            ? `${title} - Homepad of Pechlivanidis`
            : 'Homepad of Pechlivanidis'}
        </title>
        {description && <meta name="description" content={description}></meta>}
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" sx={classes.appbar}>
          <Toolbar>
            <NextLink href="/" passHref>
              <Link>
                <Typography sx={classes.brand}>
                  Homepad of Pechlivanidis
                </Typography>
              </Link>
            </NextLink>
            <div sx={classes.grow}></div>
            <Box>
              <Switch
                checked={darkModeState}
                onChange={darkModeChangeHandler}
              ></Switch>
              <NextLink href="/cart" passHref>
                <Link>
                  {cart.cartItems.length > 0 ? (
                    <Badge
                      color="secondary"
                      badgeContent={cart.cartItems.length}
                    >
                      Cart
                    </Badge>
                  ) : (
                    'Cart'
                  )}
                </Link>
              </NextLink>
              {userInfo ? (
                <>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={loginClickHandler}
                    sx={classes.navbarButton}
                  >
                    {userInfo.name}
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={loginMenuCloseHandler}
                  >
                    <MenuItem onClick={loginMenuCloseHandler}>Profile</MenuItem>
                    <MenuItem onClick={loginMenuCloseHandler}>
                      My account
                    </MenuItem>
                    <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href="/login" passHref>
                  <Link>Login</Link>
                </NextLink>
              )}
            </Box>
          </Toolbar>
        </AppBar>
        <Container sx={classes.main}>{children}</Container>
        <Box component="footer" sx={classes.footer}>
          <Typography>All rights reserved. Homepad of Pechlivanidis</Typography>
        </Box>
      </ThemeProvider>
    </div>
  );
}
