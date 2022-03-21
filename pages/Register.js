/* eslint-disable react/no-unescaped-entities */
import { Button, List, ListItem, TextField, Typography, Link as Mlink } from '@material-ui/core'
import axios from 'axios';
import { setCookies } from 'cookies-next';
//import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react'
import Layout from '../components/Layout'
import { Store } from '../utils/Store';
import useStyles from '../utils/Styles'
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';

function Register() {
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

    const submitHandler = async ({name, email, password, confirmPassword}) => {
      
        closeSnackbar();

        if (password != confirmPassword) {
          enqueueSnackbar('Passwords do not match',{variant:'error'});
          return;
        }
        try {
            const { data } = await axios.post('api/users/register', {name, email, password})
            dispatch({ type: 'USER_LOGIN', payload: data });
            //Cookies.set('userInfo', data);
            setCookies('userInfo', data);
            router.push(redirect || '/');
           
        } catch (err) {
            enqueueSnackbar(getError(err), {variant:'error'})
        }
       
    }
  return (
    <Layout title='Register'>
        <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
            <Typography component='h1' className={classes.productTexth1}>Register</Typography>
            <List>
            <ListItem>
                    <Controller
                        name="name"
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
                            id='name'
                            label='Name'
                            inputProps={{type:'text'}}
                            error = {Boolean(errors.name)}
                            helperText={errors.name? errors.name.type === 'minLength'?'Minimum length for name is 2': 'Name is Required':''}
                            {...field}    
                            ></TextField>
                        )}
                    ></Controller>
                        
                </ListItem>

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
                <Controller
                        name="confirmPassword"
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
                            id='confirmPassword'
                            label='Confirm Password'
                            inputProps={{type:'password'}}
                            error = {Boolean(errors.confirmPassword)}
                            helperText={errors.confirmPassword? errors.confirmPassword.type === 'minLength'?'Minimum length of password is 6':'Please confirm the password':''}
                            {...field}    
                            ></TextField>
                        )}
                    ></Controller>
                </ListItem>
                <ListItem>
                    <Button fullWidth variant='contained' color='primary' type='submit'>Register</Button>
                </ListItem>

                <ListItem>
                    
                        Already have an account? &nbsp;
                        <Link  href={`/Login?redirect=${redirect || '/'}`} passHref><Mlink color='inherit' className={classes.link}>Login</Mlink></Link>
                    
                </ListItem>
            </List>
        </form>
    </Layout>
  )
}

export default Register