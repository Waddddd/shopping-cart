import React,{ useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Cart from './Cart';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover'
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const useStyles = makeStyles({
  appbar:{
    backgroundColor:'indigo'
  },
  title: {
    flexGrow: 1,
  },
  popover:{
    marginTop:5,
    marginLeft:-120,
  }
});

const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => false
    }
  };

const Logout = ({selection,size,user}) => {
    const [anchorEl, setAnchorEl] = useState(false);
    const popover = useRef();

    useEffect(() => {
      const carthandle = () => {
        if(size.carts){
        if(size.carts.hasOwnProperty(user.uid)){
          let temp = size.carts[user.uid];
          let tempselected = [];
          temp.forEach(item=>{
            let pos = selection.selected.findIndex(x => x.sku===item.sku&& x.size===item.size)
            if(pos!==-1){
              if(selection.selected[pos][item.size]+item[item.size]>size[item.sku][item.size]){
                if(size[item.sku][item.size]===0) {alert(`The item ${item.title} you selected is unavailable, please remove it`)}
                else {alert(`The amount of the item ${item.title} you selected before log in and in your accout exceeds the available amount, so it is adjusted to the maximum amount.`)}
                selection.selected[pos][item.size]=size[item.sku][item.size];
              }
              else {
                selection.selected[pos][item.size]=selection.selected[pos][item.size]+item[item.size];
              }
            }
            else{
              tempselected = tempselected.concat([item]);
            }
          })
          if(tempselected.length>=1){
            let newselected = selection.selected.concat(tempselected)
            selection.setSelected(newselected);
            firebase.database().ref().child('carts/'+user.uid).set(newselected)
          }
          else{
            selection.setSelected(selection.selected);
            firebase.database().ref().child('carts/'+user.uid).set(selection.selected)
          }
        }
        else{
          firebase.database().ref().child('carts/'+user.uid).set(selection.selected)
        }
        }
        else if(Object.keys(size).length !== 0){
          firebase.database().ref().child('carts/'+user.uid).set(selection.selected)
        }
      }
      carthandle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[user])

    return(
        <React.Fragment>
        <Button 
          ref={popover}
          color="inherit" 
          size="large" 
          onClick={()=>setAnchorEl(true)}
        >
         {user.displayName}
        </Button>
        <Popover
            open={anchorEl}
            anchorEl={popover.current}
            onClose={()=>setAnchorEl(false)}
            anchorOrigin={{
                vertical:'bottom',
                horizontal:'center'
            }}
            transformOrigin={{
                vertical:'top',
                horizontal:'center'
            }}
          >
            <Button color="inherit" onClick={() => {firebase.auth().signOut();selection.setSelected([]);}}>
            Log out
            </Button>
        </Popover>
        </React.Fragment>
    )
}

const Login = () => {
    const [anchorEl, setAnchorEl] = useState(false);
    const popover = useRef();
    const classes = useStyles();

    return(
        <React.Fragment>
        <Button 
          ref={popover}
          color="inherit" 
          size="large" 
          onClick={()=>setAnchorEl(true)}
          >
            Log in
        </Button>
        <Popover
            className={classes.popover}
            open={anchorEl}
            anchorEl={popover.current}
            onClose={()=>setAnchorEl(false)}
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
      <AppBar className={classes.appbar} position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Welcome to Northwestern Shopping Store
          </Typography>
          { user? <Logout selection={selection} size={size} user={user}/> : <Login/>}
          <Cart drawerstate={drawerstate} selection={selection} size={size} user={user}/>
        </Toolbar>
      </AppBar>
  );
}

export default Appbar;