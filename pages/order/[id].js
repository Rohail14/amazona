/* eslint-disable react-hooks/rules-of-hooks */
import dynamic from 'next/dynamic';
import { Button, Card, CircularProgress, Grid, List, ListItem,  Table, TableBody, TableCell, TableHead, TableRow, Typography} from '@material-ui/core';
import Link from 'next/link';
import React, { useContext, useEffect, useReducer, useState } from 'react'
import Layout from '../../components/Layout';
import { Store } from '../../utils/Store'
import useStyles from '../../utils/Styles';
import {Link as Mlink} from '@material-ui/core'
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { getError } from '../../utils/error';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

function reducer(state,action){
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true,error:''};
        case 'FETCH_SUCCESS' :
            return {...state, loading:false,order:action.payload,error:''}
        case 'FETCH_FAIL' :
            return {...state, loading:false, error:action.payload}
        case 'PAY_REQUEST':
                return {...state, loadingPay: true};
        case 'PAY_SUCCESS' :
                return {...state, loadingPay:false,successPay: true}
        case 'PAY_FAIL' :
                return {...state, loadingPay:false, errorPay:action.payload}
        case 'PAY_RESET' :
                return {...state, loadingPay:false, successPay: false, errorPay:''}    
        default: state;
            
    }
}

function Order(params) {
  
    
    // eslint-disable-next-line no-unused-vars
    const orderId = params.params.id;
    const router = useRouter();
    const [state] = useContext(Store);
    const {userInfo} = state;
    const classes = useStyles();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    

    const [{isPending}, paypalDispatch] = usePayPalScriptReducer();

    const [{loading, error, order, successPay}, dispatch] = useReducer(reducer, {loading: true,error:'',order:{},})

    const {shippingAddress,paymentMethod,orderItems,itemsPrice,taxPrice,shippingPrice,totalPrice,isPaid,paidAt,isDelivered,deliveredAt} = order;
    
    useEffect(() => {
       if (!userInfo) {
           return router.push('/Login');
       }

       const fetchOrder = async () => {
           try {
               dispatch({type:'FETCH_REQUEST'});
               const {data} = await axios.get(`/api/orders/${orderId}`,{
                   headers: {authorization: `Bearer ${userInfo.token}`},
               });
               dispatch({type:'FETCH_SUCCESS', payload: data})

           } catch (error) {
               dispatch({type: 'FETCH_FAIL', payload:getError(error)});
           }
       }
       if(!order._id || successPay || (order._id && order._id !== orderId)){
           fetchOrder();
           if(successPay) {
               dispatch({type: 'PAY_RESET'})
           }
       } else {
           const loadPaypalScript = async () => {
               const { data: clientId } = await axios.get('/api/keys/paypal',{
                   headers: {authorization: `Bearer ${userInfo.token}`},
               });
               paypalDispatch({
                   type: 'resetOptions',
                   value: {
                       'client-id' : clientId,
                       currency: 'USD',
                   },
               });
               paypalDispatch({
                   type: 'setLoadingStatus',
                   value: 'pending'
               });
           }
           loadPaypalScript();
       }
       
    },[order,successPay])
      
    const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units:[
                {
                    amount: {value: totalPrice},
                }
            ]
        }).then((orderID) =>{
            return orderID;
        });
    }

    const onApprove = (data, actions) => {
        return actions.order.capture().then(async function (details) {
            try {
                dispatch({type:'PAY_REQUEST'});
                const {data} = await axios.put(`/api/orders/${order._id}/pay`,details,{
                    headers: {authorization: `Bearer ${userInfo.token}`}
                });
                dispatch({type:'PAY_SUCCESS',payload: data})
                enqueueSnackbar('Order is Paid',{variant:'success'});
            } catch (err) {
                dispatch({type:'PAY_FAIL',payload: getError(err)})
                enqueueSnackbar(getError(err),{variant:'error'});
            }
        });
    }
   
    const onError = (err) =>{
        enqueueSnackbar(getError(err),{variant:'error'});
    }


return (
    <Layout title={`Order ${orderId}`}>
        
        <Typography component="h1" className={classes.productTexth1}>Order Id: {orderId}</Typography>
       {loading ? (<CircularProgress/>
       ): error ? (
           <Typography className={classes.error}>{error}</Typography>
       ):(
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

                                
                                <ListItem> 
                                        Status: {' '}
                                        {isDelivered? `delivered at ${deliveredAt}` : 'not delivered'}
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

                                <ListItem>
                                        Status: {' '}
                                        {isPaid? `paid at ${paidAt}` : 'not paid'}
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
                                        {orderItems.map(item => (
                                            <TableRow key={item._id}>
                                                <TableCell>
                                                    
                                                            <Image src={item.image} alt={item.name} width={50} height={50}></Image>
                                                    
                                                </TableCell>

                                                <TableCell>
                                                    
                                                            <Typography>{item.name}</Typography>
                                                    
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
                            
                         
                                {!isPaid && (
                                    <ListItem>
                                        {isPending ? (
                                            <CircularProgress />
                                        ) : (
                                            <div className={classes.fullWidth}>
                                                <PayPalButtons
                                                createOrder={createOrder}
                                                onApprove={onApprove}
                                                onError={onError}>  
                                                </PayPalButtons>
                                                
                                            </div>
                                            
                                        )}
                                    </ListItem>
                                )}
                            
    
                        </List>
                    </Card>
                </Grid>
            </Grid>

       )
        }
       
    </Layout>
  )
}

export async function getServerSideProps({params}) {
    return {props: {params}} ;
}


// eslint-disable-next-line no-undef
export default dynamic(() => Promise.resolve(Order), {ssr: false});