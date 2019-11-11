import React,{useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Cart from './Cart';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover'
import firebase from 'firebase/app';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  popover:{
    marginTop:5,
    marginLeft:-120,
  }
}));

const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => false
    }
  };

const Signout = ({user}) => {
    const [anchorEl, setAnchorEl] = useState(null);

    return(
        <React.Fragment>
        <Button color="inherit" size="large" onClick={(e)=>{setAnchorEl(e.target);}}>
         {user.displayName}
        </Button>
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={()=>{setAnchorEl(null);}}
            anchorOrigin={{
                vertical:'bottom',
                horizontal:'center'
            }}
            transformOrigin={{
                vertical:'top',
                horizontal:'center'
            }}
          >
            <Button color="inherit" onClick={() => firebase.auth().signOut()}>
            Log out
            </Button>
        </Popover>
        </React.Fragment>
    )
}

const Signin = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const classes = useStyles();

    return(
        <React.Fragment>
        <Button color="inherit" size="large" onClick={(e)=>{setAnchorEl(e.target);}}>
            Login
        </Button>
        <Popover
            className={classes.popover}
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={()=>{setAnchorEl(null);}}
            anchorOrigin={{
                vertical:'bottom',
                horizontal:'center'
            }}
            transformOrigin={{
                vertical:'top',
                horizontal:'center'
            }}
        >
            <StyledFirebaseAuth
             uiConfig={uiConfig}
             firebaseAuth={firebase.auth()}
            />
        </Popover>
        </React.Fragment>
    )
}

const Appbar = ({drawerstate, selection, size, user}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Welcome to Northwestern Shopping Store
          </Typography>
          { user? <Signout user={user}/> : <Signin/>}
          <Cart drawerstate={drawerstate} selection={selection} size={size}/>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Appbar;