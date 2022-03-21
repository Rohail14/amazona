/* eslint-disable react/no-unescaped-entities */
import { Button, List, ListItem, TextField, Typography } from '@material-ui/core'
import { getCookie, setCookies } from 'cookies-next';
//import Cookies from 'js-cookie';

import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react'
import Layout from '../components/Layout'
import { Store } from '../utils/Store';
import useStyles from '../utils/Styles'
import { Controller, useForm } from 'react-hook-form';
import CheckoutWizard from '../components/CheckoutWizard';

function Register() {
    console.log(getCookie('shippingAddress'))
    const {handleSubmit, control, formState: {errors},setValue} = useForm();
    const router = useRouter();
  
    const [state,dispatch] = useContext(Store);
    const {userInfo,cart:{shippingAddress}} = state;

    useEffect(() => {
      if(!userInfo) {
        router.push('/Login?redirect=/Shipping');
      }

      setValue('fullName',shippingAddress.fullName);
      setValue('address',shippingAddress.address);
      setValue('city',shippingAddress.city);
      setValue('postalCode',shippingAddress.postalCode);
      setValue('country',shippingAddress.country);
    }, [])
    
   
    const classes = useStyles();

    const submitHandler = async ({fullName, address, city, postalCode, country}) => {
      
      
            dispatch({ type: 'SAVE_SHIPPING_ADDRESS', payload: {fullName, address, city, postalCode, country} });
            //Cookies.set('userInfo', data);
            setCookies('shippingAddress', {fullName, address, city, postalCode, country});
            router.push('/paymentMethod');
       
    }
  return (
    <Layout title='Shipping'>
        <CheckoutWizard activeStep={1}/>
        <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
            <Typography component='h1' className={classes.productTexth1}>Shipping</Typography>
            <List>
            <ListItem>
                    <Controller
                        name="fullName"
                        control={control}
                        defaultValue=""
                        rules={{
                            required:true,
                            minLength:4,
                        }}
                        render={({ field }) => (
                            <TextField
                            fullWidth
                            variant='outlined'
                            id='fullName'
                            label='Full Name'
                            inputProps={{type:'text'}}
                            error = {Boolean(errors.fullName)}
                            helperText={errors.fullName? errors.fullName.type === 'minLength'?'Minimum length for full name is 4': 'Full Name is Required':''}
                            {...field}    
                            ></TextField>
                        )}
                    ></Controller>
                        
                </ListItem>
                <ListItem>
                    <Controller
                        name="address"
                        control={control}
                        defaultValue=""
                        rules={{
                            required:true,
                            minLength:6,
                        }}
                        render={({ field }) => (
                            <TextField
                            fullWidth
                            variant='outlined'
                            id='address'
                            label='Address'
                            inputProps={{type:'text'}}
                            error = {Boolean(errors.address)}
                            helperText={errors.address? errors.address.type === 'minLength'?'Minimum length for Address is 6': 'Address is Required':''}
                            {...field}    
                            ></TextField>
                        )}
                    ></Controller>
                        
                </ListItem>
                <ListItem>
                    <Controller
                        name="city"
                        control={control}
                        defaultValue=""
                        rules={{
                            required:true,
                            minLength:2,
                        }}
                        render={({ field }) => (
                            <TextField
                            fullWidth
                            variant='outlined'
                            id='city'
                            label='City'
                            inputProps={{type:'text'}}
                            error = {Boolean(errors.city)}
                            helperText={errors.city? errors.city.type === 'minLength'?'Minimum length for city is 2': 'City is Required':''}
                            {...field}    
                            ></TextField>
                        )}
                    ></Controller>
                        
                </ListItem>
                <ListItem>
                    <Controller
                        name="postalCode"
                        control={control}
                        defaultValue=""
                        rules={{
                            required:true,
                            minLength:6,
                        }}
                        render={({ field }) => (
                            <TextField
                            fullWidth
                            variant='outlined'
                            id='postalCode'
                            label='Postal Code'
                            inputProps={{type:'text'}}
                            error = {Boolean(errors.postalCode)}
                            helperText={errors.postalCode? errors.postalCode.type === 'minLength'?'Minimum length for postal code is 6': 'Postal Code is Required':''}
                            {...field}    
                            ></TextField>
                        )}
                    ></Controller>
                        
                </ListItem>
                <ListItem>
                    <Controller
                        name="country"
                        control={control}
                        defaultValue=""
                        rules={{
                            required:true,
                            minLength:2,
                        }}
                        render={({ field }) => (
                            <TextField
                            fullWidth
                            variant='outlined'
                            id='country'
                            label='Country'
                            inputProps={{type:'text'}}
                            error = {Boolean(errors.country)}
                            helperText={errors.country? errors.country.type === 'minLength'?'Minimum length for Country is 2': 'Country Name is Required':''}
                            {...field}    
                            ></TextField>
                        )}
                    ></Controller>
                        
                </ListItem>
                
                <ListItem>
                    <Button fullWidth variant='contained' color='primary' type='submit'>Continue</Button>
                </ListItem>
            </List>
        </form>
    </Layout>
  )
}

export default Register