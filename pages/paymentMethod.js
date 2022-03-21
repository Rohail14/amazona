import { Button, FormControl, FormControlLabel, List, ListItem, Radio, RadioGroup, Typography } from '@material-ui/core';
import { getCookie, setCookies } from 'cookies-next';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useState } from 'react'
import CheckoutWizard from '../components/CheckoutWizard'
import Layout from '../components/Layout'
import { Store } from '../utils/Store'
import useStyles from '../utils/Styles';

function PaymentMethod() {
    const {enqueueSnackbar,closeSnackbar} = useSnackbar();
    const [state, dispatch] = useContext(Store);
    const {cart:{shippingAddress}} = state;
    const classes = useStyles();
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState('');

    useEffect(() => {
        if(!shippingAddress.address) {
            router.push('/Shipping');
        } else {
            setPaymentMethod(getCookie('paymentMethod') || '');
        }
    },[])

    const submitHandler = (e) => {
        closeSnackbar();
        e.preventDefault();

        if(!paymentMethod){
            enqueueSnackbar('Payment Method Required',{variant:'error'});
        } else {
            dispatch({type: 'SAVE_PAYMENT_METHOD', payload:paymentMethod});
            setCookies('paymentMethod', paymentMethod);
            router.push('/placeorder')
        }
    };

  return (
    <Layout title="Payment Method">
        <CheckoutWizard activeStep={2}> </CheckoutWizard>
        <form className={classes.form} onSubmit={submitHandler}>
            <Typography component='h1' className={classes.productTexth1}>Payment Method</Typography>
            <List>
                <ListItem>
                    <FormControl component='fieldset'>
                        <RadioGroup
                        aria-label='Payment Method'
                        name='paymentMethod'
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <FormControlLabel
                                label="PayPal"
                                value="PayPal"
                                control={<Radio />}
                            ></FormControlLabel>

                            <FormControlLabel
                                label="Stripe"
                                value="Stripe"
                                control={<Radio />}
                            ></FormControlLabel>

                            <FormControlLabel
                                label="Cash"
                                value="Cash"
                                control={<Radio />}
                            ></FormControlLabel>
                        </RadioGroup>
                    </FormControl>
                </ListItem>

                <ListItem>
                    <Button fullWidth type='submit' variant='contained' color='primary'>Continue</Button>
                </ListItem>

                <ListItem>
                    <Button fullWidth type='button' variant='contained' onClick={() => router.push('/Shipping')}>Back</Button>
                </ListItem>
            </List>
        </form>
    </Layout>
  )
}

export default PaymentMethod