import  { useContext, useEffect, useReducer } from 'react'
import { Store } from '../utils/Store';
import { useRouter } from 'next/router'
import { getError } from '../utils/error';
import Layout from '../components/Layout';
import { Button, Card, CircularProgress, Grid, Link, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import useStyles from '../utils/Styles';
import dynamic from "next/dynamic"
import axios from 'axios';

function reducer(state,action){
    switch (action.type) {
        case 'FETCH_REQUEST':
            return {...state, loading: true,error:''};
        case 'FETCH_SUCCESS' :
            return {...state, loading:false,orders:action.payload,error:''}
        case 'FETCH_FAIL' :
            return {...state, loading:false, error:action.payload}
        default: state;
            
    }
}

function OrderHistory() {
    
    
    const [state] = useContext(Store);
    const {userInfo} = state;
    const router = useRouter();
    const classes = useStyles();

    const [{loading, error, orders}, dispatch] = useReducer(reducer, {loading: true,error:'',orders:{},})
    
    
    useEffect(() => {
        if (!userInfo) {
            router.push('/Login');
        }
        const fetchOrders = async () => {
            try {
                dispatch({type:'FETCH_REQUEST'});
                const {data} = await axios.get(`/api/orders/history`,{
                    headers: {authorization: `Bearer ${userInfo.token}`},
                });
                dispatch({type:'FETCH_SUCCESS', payload: data})
 
            } catch (error) {
                dispatch({type: 'FETCH_FAIL', payload:getError(error)});
            }
        };
        fetchOrders();
       }, [])
  
    return (
    
    <Layout title="Order History">
        <Grid container spacing={1}>
            <Grid item md={3} xs={12}>
                <Card className={classes.marginBottom}>
                    <List>
                        <Link href='/profile' passHref>
                            <ListItem button component='a'>
                                <ListItemText primary='User Profile'></ListItemText>
                            </ListItem>
                        </Link>

                        <Link href='/order-history' passHref>
                            <ListItem selected button component='a'>
                                <ListItemText primary='Order History'></ListItemText>
                            </ListItem>
                        </Link>
                    </List>
                </Card>
            </Grid>

            <Grid item md={9} xs={12}>
                <Card className={classes.marginBottom}>
                    <List>
                        <ListItem>
                            <Typography component='h1' className={classes.productTexth1}>
                                Order History
                            </Typography>
                        </ListItem>

                        <ListItem>
                        {loading ? (<CircularProgress/>
                         ): error ? (
                            <Typography className={classes.error}>{error}</Typography>
                        ):(
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>DATE</TableCell>
                                            <TableCell>TOTAL</TableCell>
                                            <TableCell>PAID</TableCell>
                                            <TableCell>DELIVERED</TableCell>
                                            <TableCell>ACTION</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {orders.map((order) => (
                                            <TableRow key={order._id}>
                                                <TableCell>{order._id.substring(20, 24)}</TableCell>
                                                <TableCell>{order.createdAt}</TableCell>
                                                <TableCell>${order.totalPrice}</TableCell>
                                                <TableCell>
                                                    {order.isPaid? `paid at ${order.paidAt}` : 'not paid'}
                                                </TableCell>
                                                <TableCell>
                                                    <Link href={`/order/${order._id}`}>
                                                        <Button variant='contained'>Details</Button>
                                                    </Link>
                                                </TableCell>

                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                        </ListItem>
                    </List>
                </Card>
            </Grid>

        </Grid>
                           
</Layout>)
}

// eslint-disable-next-line no-undef
export default dynamic(() => Promise.resolve(OrderHistory), {ssr: false});