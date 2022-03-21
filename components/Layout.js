import { AppBar, Container, Toolbar, Typography, Link as Mlink, ThemeProvider, CssBaseline, Switch, Badge, Button, Menu, MenuItem,} from '@material-ui/core'
import Head from 'next/head'
import Link from 'next/link';
import React, { useContext, useState } from 'react'
import useStyles from '../utils/Styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { createTheme } from '@material-ui/core/styles';
import { Store } from '../utils/Store';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';


function Layout({title,children,description}) {

    const router = useRouter();

    const [state, dispatch] = useContext(Store);

    const {darkMode,cart,userInfo} = state;

    console.log(userInfo);

    const theme = createTheme({
        
        typography:{
            h2:{
                fontSize: '1.2rem',
                fontWeight: 400,
            },
        },

        palette:{
            type:darkMode? 'dark' :'light',
        }

    });
    const classes = useStyles();

    const darkModeHandler = () => {
        dispatch({type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON'});
        const newDarkMode = !darkMode;
        Cookies.set('darkMode', newDarkMode? 'ON' : 'OFF');
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const loginClickHandler = (e) => {
        setAnchorEl(e.currentTarget);
    }

    const loginMenuCloseHandler = (e, redirect) => {
        setAnchorEl(null);
        if (redirect) {
            router.push(redirect);
        }
    }

    const logoutClickHandler = () => {
        setAnchorEl(null);
        dispatch({type: 'USER_LOGOUT'});
        Cookies.remove('userInfo');
        Cookies.remove('cartItems');
        router.push('/')
    }
  return (
    <div>
        <Head>
            <title>{title ? `${title} - Amazona` : 'Amazona'}</title>
            {description && <meta name='description' content='{description}'></meta>}
        </Head>
        <ThemeProvider theme={theme}>
            <CssBaseline/>
                <AppBar position='static' className={classes.navbar}>
                    <Toolbar>
                        <Link href="/" passHref>
                            <Mlink underline='none' color='inherit'>
                                <Typography className={classes.brand}><a>amazona</a></Typography>
                            </Mlink>
                        </Link>
                        <div className={classes.grow}></div>
                        
                        <Switch value={darkMode} onChange={darkModeHandler}></Switch>

                       
                            {userInfo? (
                                <>
                                <Button className={classes.buttonNav}
                                    aria-controls='simple-menu'
                                    aria-haspopup='true'
                                    onClick={loginClickHandler}
                                    >
                                {userInfo.name}                             
                                </Button>
                                
                                    <Menu
                                    id='simple-menu'
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={loginMenuCloseHandler}>
                                        <MenuItem onClick={(e) => loginMenuCloseHandler(e ,'/profile')}>Profile</MenuItem>
                                        <MenuItem onClick={(e) => loginMenuCloseHandler(e ,'/order-history')}>Order History</MenuItem>
                                        <MenuItem onClick={logoutClickHandler}>Logout</MenuItem>
                                    </Menu>
                                </>
                                ) : (
                                    <div className={classes.navbarButton}>
                                        <Link href="/Login" passHref>
                                            <Mlink  underline='none' color='inherit'>
                                                Login
                                            </Mlink>
                                        </Link>
                                    </div>
                                )
                            }   
                        
                        
                        
                            <div className={classes.navbarButton}>
                                <Link href="/cart" passHref>
                                    <Mlink underline='none' color='inherit'>
                                        {cart.cartItems.length > 0 ? <Badge color="secondary"  badgeContent={cart.cartItems.length}><ShoppingCartIcon/></Badge>
                                        : <ShoppingCartIcon/> }
                                    
                                    </Mlink>
                                </Link>
                            </div>

                            
                        
                    </Toolbar>
                </AppBar>
            </ThemeProvider>
        
        <Container className={classes.main}>
            {children}
        </Container>
        <footer className={classes.footer}>
            All Rights Reserved @amazona
        </footer>
    </div>
  )
}

export default Layout