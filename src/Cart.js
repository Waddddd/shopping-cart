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

const useStyles = makeStyles(theme => ({
  list: {
    width: 400,
  },
  card:{
    display: 'flex',

  },
  cardcontent:{
    display: 'flex',
    flexDirection: 'column'
  },
  cardmedia:{
    width: 49.5,
    height:72,
    marginTop:10,
    marginLeft:5,
  },
  iconbutton:{
    marginLeft:150,
    marginTop:-40,
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
  return(
    <div>
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
      Quantity: {item.quantity}
    </Typography>
    </CardContent>
    <IconButton size="small" className={classes.iconbutton} onClick={()=>{selection.deleteToggle(item)}}>
      <ClearIcon fontSize="small"/>
    </IconButton>
    </Card>
    )}
    </div>
  );
};

export default Cart;