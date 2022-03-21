/* eslint-disable react-hooks/rules-of-hooks */
import dynamic from 'next/dynamic';
import { Button, Card, Grid, List, ListItem, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, Typography} from '@material-ui/core';
import Link from 'next/link';
import React, { useContext } from 'react'
import Layout from '../components/Layout';
import { Store } from '../utils/Store'
import useStyles from '../utils/Styles';
import {Link as Mlink} from '@material-ui/core'
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/router';

function cart() {
  
    // eslint-disable-next-line no-unused-vars
    const router = useRouter();
    const [state,dispatch] = useContext(Store);
    const {cart:{cartItems}} = state;
    const classes = useStyles();
  
    const updateCartHandler = async (item, quantity) => {
        const {data} = await axios.get(`/api/products/${item._id}`);
        try {
                if (data.countInStock <= quantity){
                    window.alert('Sorry. Product is out of stock');
                    return;
                }
                
                dispatch({type: 'ADD_TO_CART', payload:{...item, quantity}},);
                
        } catch (error) {
            console.log(error);
        }
    }

    const removeItemHandler = (item) => {
        dispatch({type: 'REMOVE_CART_ITEM', payload: item});
    }

    const checkoutHandler = () => {
        router.push('/Shipping');
    }
return (
    <Layout title="Shopping Cart">
        <Typography component="h1" className={classes.productTexth1}>Shopping Cart</Typography>
        {cartItems.length === 0 ? (<div>Cart is Empty. <Link href='/' passHref><Mlink underline='none' color='secondary'>Go Shopping</Mlink></Link></div>
        ):(

        <Grid container spacing={1}>
                <Grid item md={9} xs={12}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Image</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell align='right'>Quantity</TableCell>
                                <TableCell align='right'>Price</TableCell>
                                <TableCell align='right'>Action</TableCell>
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
                                        <Select value={item.quantity} onChange={(e) => (updateCartHandler (item, e.target.value))}>
                                            {[...Array(item.countInStock).keys()].map((x) => (
                                                <MenuItem key={x+1} value={x+1}>
                                                    {x+1}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>
                                    <TableCell align='right'>
                                        ${item.price}
                                    </TableCell>
                                    <TableCell align='right'>
                                        <Button  color='secondary' onClick={() => removeItemHandler(item)}>Remove</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
                <Grid item md={3} xs={12}>
                    <Card>
                        <List>
                            <ListItem>
                                <Typography className={classes.productTexth2}>
                                    Subtotal ({cartItems.reduce((a,c) => a + c.quantity, 0)}{' '}items) :${' '}
                                    {cartItems.reduce((a,c) => a+c.quantity * c.price, 0)}
                                </Typography>
                            </ListItem>
                            <ListItem>
                                <Button color='primary' variant='contained' fullWidth onClick={checkoutHandler}>Go Checkout</Button>
                            </ListItem>
                        </List>
                    </Card>
                </Grid>
            </Grid>
        )}
    </Layout>
  )
}

// eslint-disable-next-line no-undef
export default dynamic(() => Promise.resolve(cart), {ssr: false});