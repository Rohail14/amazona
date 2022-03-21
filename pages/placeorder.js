/* eslint-disable react-hooks/rules-of-hooks */
import dynamic from 'next/dynamic';
import { Button, Card, CircularProgress, Grid, List, ListItem,  Table, TableBody, TableCell, TableHead, TableRow, Typography} from '@material-ui/core';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'
import Layout from '../components/Layout';
import { Store } from '../utils/Store'
import useStyles from '../utils/Styles';
import {Link as Mlink} from '@material-ui/core'
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/router';
import CheckoutWizard from '../components/CheckoutWizard';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';
import { removeCookies } from 'cookies-next';

function PlaceOrder() {
  
    // eslint-disable-next-line no-unused-vars
    const router = useRouter();
    const [state,dispatch] = useContext(Store);
    const {userInfo,cart:{cartItems,shippingAddress,paymentMethod}} = state;
    const classes = useStyles();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(false);

    const round2 = (num) => Math.round(num*100 + Number.EPSILON) / 100;
    const itemsPrice = round2(cartItems.reduce((a, c) => a + c.price * c.quantity, 0));
    const shippingPrice = itemsPrice > 200 ? 0 : 15;
    const taxPrice = round2(itemsPrice * 0.15);
    const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

    useEffect(() => {
        if(!paymentMethod) {
          router.push('/paymentMethod')
        }
        if(cartItems.length === 0) {
            router.push('/cart');
        }
    },[])
      
    
    const placeOrderHandler = async () =>{
        closeSnackbar();
        try {
            setLoading(true);
            // eslint-disable-next-line no-unused-vars
            const {data} = await axios.post('/api/orders',{
                orderItems: cartItems,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            },{
                headers: {
                    authorization: `Bearer ${userInfo.token}`,
                }
            });
            dispatch({type:'CLEAR_CART'});
            removeCookies('cartItems');
            setLoading(false);
            router.push(`/order/${data._id}`);
        } catch (error) {
            setLoading(false);
            enqueueSnackbar(getError(error),{variant:'error'})
        }
    }
   
return (
    <Layout title="Place Order">
        <CheckoutWizard activeStep={3}></CheckoutWizard>
        <Typography component="h1" className={classes.productTexth1}>Place Order</Typography>
       
        <Grid container spacing={1}>
                <Grid item md={9} xs={12}>

                    
                    <Card className={classes.marginBottom}>
                            <List>
                                <ListItem>
                                        <Typography component='h2' className={classes.productTexth2}>
                                            Shipping Address
                                        </Typography>
                                </ListItem>

                                <ListItem> 
                                        {shippingAddress.fullName},{' '}{shippingAddress.address},{' '}
                                        {shippingAddress.city},{' '}{shippingAddress.postalCode},{' '}
                                        {shippingAddress.country}
                                </ListItem>
                            </List>
                    </Card>

                    <Card className={classes.marginBottom}>
                            <List>
                                <ListItem>
                                        <Typography component='h2' className={classes.productTexth2}>
                                            Payment Method
                                        </Typography>
                                </ListItem>

                                <ListItem> 
                                       {paymentMethod}
                                </ListItem>
                            </List>
                    </Card>

                    <Card>
                        <List>
                            <ListItem>
                                    <Typography component='h2' className={classes.productTexth2}>
                                        Order Items
                                    </Typography>
                            </ListItem>
                                    
                            <ListItem>

                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Image</TableCell>
                                            <TableCell>Name</TableCell>
                                            <TableCell align='right'>Quantity</TableCell>
                                            <TableCell align='right'>Price</TableCell>
                                        
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {cartItems.map(item => (
                                            <TableRow key={item._id}>
                                                <TableCell>
                                                    <Link href={`/product/${item.slug}`} passHref>
                                                        <Mlink>
                                                            <Image src={item.image} alt={item.name} width={50} height={50}></Image>
                                                        </Mlink>
                                                    </Link>
                                                </TableCell>

                                                <TableCell>
                                                    <Link href={`/product/${item.slug}`} passHref>
                                                        <Mlink>
                                                            <Typography>{item.name}</Typography>
                                                        </Mlink>
                                                    </Link>
                                                </TableCell>
                                                <TableCell align='right'>
                                                <Typography>{item.quantity}</Typography>
                                                </TableCell>
                                                <TableCell align='right'>
                                                    <Typography>${item.price}</Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ListItem>
                        </List>
                        
                    </Card>
                    
                </Grid>
                <Grid item md={3} xs={12}>
                    <Card>
                        <List>
                            <ListItem>
                                <Typography className={classes.productTexth2}>
                                   Order Summary
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={6}><Typography>Items:</Typography></Grid>
                                    <Grid item xs={6}><Typography align='right'>${itemsPrice}</Typography></Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={6}><Typography>Tax:</Typography></Grid>
                                    <Grid item xs={6}><Typography align='right'>${taxPrice}</Typography></Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={6}><Typography>Shipping</Typography></Grid>
                                    <Grid item xs={6}><Typography align='right'>${shippingPrice}</Typography></Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={6}><Typography><strong>Total:</strong></Typography></Grid>
                                    <Grid item xs={6}><Typography align='right'><strong>${totalPrice}</strong></Typography></Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Button onClick={placeOrderHandler}color='primary' variant='contained' fullWidth >Place Order</Button>
                            </ListItem>
                            {loading && (
                                <ListItem>
                                    <CircularProgress />
                                </ListItem>
                            )}
                        </List>
                    </Card>
                </Grid>
            </Grid>

    </Layout>
  )
}

// eslint-disable-next-line no-undef
export default dynamic(() => Promise.resolve(PlaceOrder), {ssr: false});