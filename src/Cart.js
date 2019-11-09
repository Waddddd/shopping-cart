import React from 'react'
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import CloseIcon from '@material-ui/icons/Close'
import ClearIcon from '@material-ui/icons/Clear';
import Divider from '@material-ui/core/Divider'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import useForceUpdate from 'use-force-update';

const useStyles = makeStyles(theme => ({
  list: {
    width: 400,
  },
  shoppinglist:{
    height:600
  },
  card:{
    display: 'flex',

  },
  cardcontent:{
    display: 'flex',
    flexDirection: 'column',
    minWidth:200,
  },
  cardmedia:{
    width: 49.5,
    height:72,
    marginTop:10,
    marginLeft:5,
  },
  clearbutton:{
    display:'flex',
    flexDirection:'column',
    marginTop:15,
    marginLeft:80
  },
  adjustbutton:{
    display:'flex',
    flexDirection:'row',
    marginTop:30,
    marginLeft:-26
  },
  checkout:{
    display:'flex',
    flex:'wrap',
    margin:10,
  },
  checkoutprice:{
    flexGrow:1
  }
}));

const Cart = ({drawerstate, selection}) => {

  return(
    <div>
      <IconButton color="primary" onClick={() => drawerstate.setState(true)} aira-label="add to shopping cart">
        <AddShoppingCartIcon fontSize="large"/>
      </IconButton>
      <Drawer
        anchor="right"
        open={drawerstate.state}
      >
      <SideList drawerstate={drawerstate} selection={selection}/>
      </Drawer>
    </div>
  );
};

const SideList = ({drawerstate,selection}) => {
  const classes = useStyles();

  return(
    <div className={classes.list}>
    <Grid container>
      <Grid item xs={5}>
      <IconButton onClick={() => drawerstate.setState(false)} aira-label="close shopping cart">
        <CloseIcon fontSize="large"/>
      </IconButton>
      </Grid>
      <Grid item xs={7}>
      <IconButton aira-label="shopping cart">
        <ShoppingCartIcon color="primary" fontSize="large"/>
      </IconButton>
      </Grid>
    </Grid>
    <Divider/>
    <ShoppingList selection={selection}/>
    </div>
  );
};

const ShoppingList = ({selection}) => {
  const classes = useStyles();
  const forceUpdate = useForceUpdate();

  return(
    <React.Fragment>
    <div className={classes.shoppinglist}>
    {selection.selected.map(item => 
    <Card key={item.sku} className={classes.card}>
    <CardMedia
      className = {classes.cardmedia}
      component="img"
      image = {"data/products/"+item.sku+"_1.jpg"}
      alt="product image"
    />
    <CardContent className={classes.cardcontent}>
    <Typography variant="subtitle2">
      {item.title} 
    </Typography>
    <Typography variant="caption">
      {item.style}
    </Typography>
    <Typography variant="caption">
      {item.currencyFormat}{item.price} 
    </Typography>
    <Typography variant="caption">
      Quantity: {item.quantity}
    </Typography>
    </CardContent>
    <div className={classes.clearbutton}>
    <IconButton size="small" onClick={()=>{selection.deleteToggle(item)}}>
        <ClearIcon fontSize="small"/>
    </IconButton>
    <div className={classes.adjustbutton}>
    <IconButton className={classes.addbutton} size="small" onClick={()=>{selection.addToggle(item);forceUpdate()}}>
        {console.log(item.quantity)}
        <AddIcon fontSize="small"/>
    </IconButton>
    <IconButton size="small" disabled={item.quantity===1} onClick={()=>{selection.decreaseToggle(item);forceUpdate()}}>
        <RemoveIcon fontSize="small"/>
    </IconButton>
    </div>
    </div>
    </Card>
    )}
    </div>
    <Divider/>
    <Checkout selection={selection}/>
    </React.Fragment>
  );
};

const Checkout = ({selection}) => {
    const classes = useStyles();
    let total=0.00;
    if(selection.selected.length<1){
        return(
            <div className={classes.checkout}>
            <Typography variant="h6" className={classes.checkoutprice}>
            SUBTOTAL                      
            </Typography>
             <Typography variant="h6">
             $0.00                 
            </Typography>
            </div>
        )
    }
    else{
        selection.selected.forEach(item=>total+=item.quantity*item.price);
        return(
            <div className={classes.checkout}>
            <Typography variant="h6" className={classes.checkoutprice}>
            SUBTOTAL                  
            </Typography>
            <Typography variant="h6">
            ${total}            
            </Typography>
            </div>
        )
    }
}

export default Cart;