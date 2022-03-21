/* eslint-disable react/no-unescaped-entities */
import { Button, List, ListItem, TextField, Typography, Link as Mlink } from '@material-ui/core'
import axios from 'axios';
import { setCookies } from 'cookies-next';
//import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, } from 'react'
import { Controller, useForm } from 'react-hook-form';
import Layout from '../components/Layout'
import { Store } from '../utils/Store';
import useStyles from '../utils/Styles'

function Login() {
    const {handleSubmit, control, formState: {errors}} = useForm();
    const {enqueueSnackbar,closeSnackbar} = useSnackbar();
    const router = useRouter();
    const {redirect} = router.query;
    const [state,dispatch] = useContext(Store);
    const {userInfo} = state;
    useEffect(() => {
        if(userInfo) {
          router.push('/');
        }
      }, [])
      
    const classes = useStyles();
    
    const submitHandler = async ({email, password}) => {
        closeSnackbar();
        try {
            const {data} = await axios.post('api/users/login', {email, password})
            dispatch({ type: 'USER_LOGIN', payload: data });
            //Cookies.set('userInfo', data);
            setCookies('userInfo', data);
            router.push(redirect || '/');
           
        } catch (err) {
            enqueueSnackbar(err.response.data? err.response.data.message : err.message,{variant:'error'});
        }
       
    }
  return (
    <Layout title='Login'>
        <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
            <Typography component='h1' className={classes.productTexth1}>Login</Typography>
            <List>
                <ListItem>
                    <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        rules={{
                            required:true,
                            pattern: /^[a-z0-9._%+-]+@[a-z0-9._]+\.[a-z]{2,4}$/,
                        }}
                        render={({ field }) => (
                            <TextField
                            fullWidth
                            variant='outlined'
                            id='email'
                            label='Email'
                            inputProps={{type:'email'}}
                            error = {Boolean(errors.email)}
                            helperText={errors.email? errors.email.type === 'pattern'?'Email is not valid':'Email is Required':''}
                            {...field}    
                            ></TextField>
                        )}
                    ></Controller>
                        
                </ListItem>

                <ListItem>
                <Controller
                        name="password"
                        control={control}
                        defaultValue=""
                        rules={{
                            required:true,
                            minLength: 6,
                        }}
                        render={({ field }) => (
                            <TextField
                            fullWidth
                            variant='outlined'
                            id='password'
                            label='Password'
                            inputProps={{type:'password'}}
                            error = {Boolean(errors.password)}
                            helperText={errors.password? errors.password.type === 'minLength'?'Minimum length of password is 6':'Password is Required':''}
                            {...field}    
                            ></TextField>
                        )}
                    ></Controller>
                </ListItem>

                <ListItem>
                    <Button fullWidth variant='contained' color='primary' type='submit'>Login</Button>
                </ListItem>
                <ListItem>
                    
                        Don't have an account? &nbsp;
                        <Link href={`/Register?redirect=${redirect || '/'}`} passHref><Mlink color='inherit' className={classes.link}>Register</Mlink></Link>
                    
                </ListItem>
            </List>
        </form>
    </Layout>
  )
}

export default Login