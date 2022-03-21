import  { useContext, useEffect,  } from 'react'
import { Store } from '../utils/Store';
import { useRouter } from 'next/router'
import { getError } from '../utils/error';
import Layout from '../components/Layout';
import { Button, Card, Grid, Link, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@material-ui/core';
import useStyles from '../utils/Styles';
import dynamic from "next/dynamic"
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { setCookies } from 'cookies-next';



function Profile() {
    
    const {handleSubmit, control, formState: {errors},setValue} = useForm();
    
    const [state, dispatch] = useContext(Store);
    const {userInfo} = state;
    const router = useRouter();
    const classes = useStyles();

   
    const {enqueueSnackbar,closeSnackbar} = useSnackbar();
    
    useEffect(() => {
        if (!userInfo) {
            return router.push('/Login');
        }
         setValue('name', userInfo.name);
         setValue('email', userInfo.email);

       }, [])


       const submitHandler = async ({name, email, password, confirmPassword}) => {
      
        closeSnackbar();

        if (password != confirmPassword) {
          enqueueSnackbar('Passwords do not match',{variant:'error'});
          return;
        }
        try {
            const { data } = await axios.put('api/users/profile', {name, email, password},{
                headers: {authorization: `Bearer ${userInfo.token}`}
            })
            dispatch({ type: 'USER_LOGIN', payload: data });
            //Cookies.set('userInfo', data);
            setCookies('userInfo', data);
            enqueueSnackbar('Profile Updated Successfully', {variant : 'success'});
           
        } catch (err) {
            enqueueSnackbar(getError(err), {variant:'error'})
        }
       
    }
  
    return (
    
    <Layout title="Profile">
        <Grid container spacing={1}>
            <Grid item md={3} xs={12}>
                <Card className={classes.marginBottom}>
                    <List>
                        <Link href='/profile' passHref>
                            <ListItem selected button component='a'>
                                <ListItemText primary='User Profile'></ListItemText>
                            </ListItem>
                        </Link>

                        <Link href='/order-history' passHref>
                            <ListItem  button component='a'>
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
                                Profile
                            </Typography>
                        </ListItem>

                        <ListItem>
                            <form onSubmit={handleSubmit(submitHandler)} className={classes.form}>
              
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
                                            
                                                validate: (value) => (value === '' || value.length > 5 || 'Password length required is 6')
                                            }}
                                            render={({ field }) => (
                                                <TextField
                                                fullWidth
                                                variant='outlined'
                                                id='password'
                                                label='Password'
                                                inputProps={{type:'password'}}
                                                error = {Boolean(errors.password)}
                                                helperText={errors.password?'Minimum length of password is 6':''}
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
                                                
                                                validate: (value) => (value === '' || value.length > 5 || 'Password length required is 6')
                                                
                                            }}
                                            render={({ field }) => (
                                                <TextField
                                                fullWidth
                                                variant='outlined'
                                                id='confirmPassword'
                                                label='Confirm Password'
                                                inputProps={{type:'password'}}
                                                error = {Boolean(errors.confirmPassword)}
                                                helperText={errors.password?'Minimum length of Confirm password is 6':''}
                                                {...field}    
                                                ></TextField>
                                            )}
                                        ></Controller>
                                    </ListItem>
                                    <ListItem>
                                        <Button fullWidth variant='contained' color='primary' type='submit'>Update</Button>
                                    </ListItem>

                                </List>
                            </form>
                        </ListItem>
                    </List>
                </Card>
            </Grid>

        </Grid>
                           
</Layout>)
}

// eslint-disable-next-line no-undef
export default dynamic(() => Promise.resolve(Profile), {ssr: false});