import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from "@material-ui/core";
import axios from "axios";
import Link from "next/link";
import { useContext } from "react";
import Layout from "../components/Layout";
import Product from "../models/Product";
import db from "../utils/db";
import { Store } from "../utils/Store";
import useStyles from "../utils/Styles";

export default function Home(props) {

  const {products} = props;
  const classes = useStyles();
  // eslint-disable-next-line no-unused-vars
  const [state,dispatch] = useContext(Store);

  const addToCartHandler = async (product) => {
    const {data} = await axios.get(`/api/products/${product._id}`);
          try {
                  const existItem = state.cart.cartItems.find(x => x._id === product._id);
                  const quantity = existItem ? existItem.quantity + 1 : 1 ;


                  if (data.countInStock < quantity){
                    window.alert('Sorry. Product is out of stock');
                    return;
                }
                  
                  dispatch({type: 'ADD_TO_CART', payload:{...product, quantity}},);
                  
          } catch (error) {
              console.log(error);
          }
  }

  return (
     <Layout>
       <h1>Products</h1>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item md={4} key={product.name}>
              <Card className={classes.popUp}>
              <Link href={`/product/${product.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia 
                      component="img" 
                      image={product.image} 
                      title={product.name}>
                    </CardMedia>
                    <CardContent>
                      <Typography>
                        {product.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Link>
                <CardActions>
                  <Typography>${product.price}</Typography>
                  <Button size='small' color='secondary' onClick={() => addToCartHandler(product)}>
                      Add to cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
     </Layout>
  )
}

export async function getServerSideProps(){
  await db.connect();
  const products = await Product.find({}).lean();
  await db.disconnect();

  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}