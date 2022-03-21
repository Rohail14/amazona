import { Step, StepLabel, Stepper } from '@material-ui/core'
import React from 'react'
import useStyles from '../utils/Styles'

export default function CheckoutWizard({ activeStep = 0}) {
  const classes = useStyles();
  
  return (
    <Stepper className={classes.transparentBG} activeStep={activeStep} alternativeLabel>
        {['Login', 'Shipping', 'Payment Method', 'Place Order'].map((step) => (
            <Step key={step}>
                <StepLabel>{step}</StepLabel>
            </Step>
        ))}
    </Stepper>
  )
}
