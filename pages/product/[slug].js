import Link from 'next/link';

import React, { useContext } from 'react'
import Layout from '../../components/Layout';

import {Button, Card, Grid, Link as Mlink, List, ListItem, Typography} from '@material-ui/core';
import Image from 'next/image';
import useStyles from '../../utils/Styles';
import Product from '../../models/Product';
import db from '../../utils/db';
import axios from 'axios';
import { Store } from '../../utils/Store';
import { useRouter } from 'next/router';


export default function ProductScreen(props) {

    const router = useRouter();
    // eslint-disable-next-line no-unused-vars
    const [state,dispatch] = useContext(Store);

    const {products} = props;
    const classes = useStyles();
    

    if(!products){
        return <div>Product not Found</div>
    }

    const addToCartHandler = async () => {
        const {data} = await axios.get(`/api/products/${products._id}`);
        try {
                const existItem = state.cart.cartItems.find(x => x._id === products._id);
                const quantity = existItem ? existItem.quantity + 1 : 1 ;
                
                if (data.countInStock < quantity){
                    window.alert('Sorry. Product is out of stock');
                    return;
                }

                dispatch({type: 'ADD_TO_CART', payload:{...products, quantity}},);
                router.push('/cart');
                
        } catch (error) {
            console.log(error);
        }
      
    }

    return ( 
      <Layout title={products.name} description={products.description}>
          <div className={classes.linkBack}>
              <Link href='/' passHref>
                  <Mlink underline='none' color='inherit'>
                      Back
                  </Mlink>
              </Link>
          </div>

          <Grid container spacing={1}>
              <Grid item md={6} xs={12}>
                  <Image className ={classes.productImg} src={products.image} alt={products.name} width={500} height={500} layout="responsive"></Image>
                {/* <img className={classes.productImg} src={products.image} alt={products.name}/> */}
              </Grid>
              <Grid item md={3} xs={12}>
                    <List>
                        <ListItem ><Typography className={classes.productTexth1} component="h1" variant="h1">{products.name}</Typography></ListItem>
                        <ListItem><Typography >Category: {products.category}</Typography></ListItem>
                        <ListItem><Typography >Brand: {products.brand}</Typography></ListItem>
                        <ListItem><Typography>Rating: {products.rating} Stars ({products.numReviews} Reviews) </Typography></ListItem>
                        <ListItem><Typography>Description: {products.description} </Typography></ListItem>
                    </List>
              </Grid>
              <Grid item md={3} xs={12}>
                  <Card>
                      <List>
                          <ListItem>
                              <Grid container>
                                  <Grid item xs={6}>
                                      <Typography>Price</Typography>
                                  </Grid>
                                  <Grid item xs={6}>
                                      <Typography>${products.price}</Typography>
                                  </Grid>
                              </Grid>
                          </ListItem>
                          <ListItem>
                              <Grid container>
                                  <Grid item xs={6}>
                                      <Typography>Status</Typography>
                                  </Grid>
                                  <Grid item xs={6}>
                                      <Typography>{products.countInStock > 0 ? "In Stock" : "Out of Stock"}</Typography>
                                  </Grid>
                              </Grid>
                          </ListItem>
                          <ListItem>
                              <Button fullWidth variant='contained' color='secondary'
                              onClick={addToCartHandler}
                              >
                                Add To Cart
                              </Button>
                          </ListItem>
                      </List>
                  </Card>
              </Grid>
          </Grid>
      </Layout>
    )
  }

  export async function getServerSideProps(context){
    const {params} = context;
    const {slug} = params;

    await db.connect();
    const product = await Product.findOne({slug}).lean();
    await db.disconnect();
  
    return {
      props: {
        products: db.convertDocToObj(product),
      },
    }; 
}