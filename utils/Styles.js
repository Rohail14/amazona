import { makeStyles } from "@material-ui/core";


const useStyles = makeStyles({
    navbar: {
        backgroundColor: '#203040',
        '& a':{
            color: 'ffffff',
            marginLeft: 10,
        }
    },
    brand:{
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
    grow:{
        flexGrow: 1,
    },

    navbarButton:{
        marginLeft:20,
        transition: 'transform 0.1s',
        '&:hover':{
            transform:'scale(1.01)'
        }
    },

    buttonNav:{
        color:"#ffffff",
        textTransform: 'initial',
    },
    main:{
        minHeight: '80vh',
    },
    footer:{
        marginTop: 20,
        marginBottom : 20,
        textAlign: 'center',
        color: 'grey',
        opacity: '0.6',
        fontWeight: 'bold',
    },

    //Link Back
    linkBack: {
        marginTop:10,
        marginBottom:20,
    },
    //Product section

    popUp:{
        transition: 'transform 0.3s',
        '&:hover':{
            transform:'scale(1.02)',
        }
    },
    
    productImg: {
        width: 550,
        height: 550,
        borderRadius: 9,
        boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
        
    },

    productTexth1:{
        fontWeight: 'bold',
        fontSize: '1.6rem',
        margin: '1rem 0',
    },
    productTexth2:{
        fontSize: '1.2rem',
        fontWeight: 400,
    },
    productText:{
        fontWeight: 'bold',
    },
    form:{
        width:'100%',
        maxWidth: 700,
        margin:'0 auto',
    },
    link:{
        '&:hover':{
            color: '#f73378',
        }
    },
    transparentBG:{
        backgroundColor: 'transparent'
    },
    marginBottom:{
        marginBottom: 15,
    },
    error:{
        color:'#f04040',
    },
    fullWidth:{
        width:'100%',
    }
})

export default useStyles
