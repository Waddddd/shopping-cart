import React,{useEffect} from 'react'
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
import Button from '@material-ui/core/Button';
import firebase from 'firebase/app';
import 'firebase/database';

const useStyles = makeStyles({
  list: {
    width: 380,
  },
  shoppinglist:{
    height:600,
    maxHeight:600,
    overflow: 'auto',
  },
  cartbutton:{
    color:'indigo'
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
    marginTop:18,
    marginLeft:5,
  },
  clearbutton:{
    display:'flex',
    flexDirection:'column',
    marginTop:15,
    marginLeft:60
  },
  adjustbutton:{
    display:'flex',
    flexDirection:'row',
    marginTop:45,
    marginLeft:-26
  },
  checkout:{
    display:'flex',
    flex:'wrap',
    margin:10,
  },
  checkoutprice:{
    flexGrow:1
  },
  checkoutbutton:{
    marginLeft:25,
    marginTop:10,
    fontSize:20,
    width:350,
    backgroundColor: total=>total?'indigo':'white',
    color:'white',
    '&:hover':{backgroundColor:'black'}
  }
});

const Cart = ({drawerstate,selection,size,user}) => {

  return(
    <div>
      <IconButton 
        color="inherit" 
        onClick={() => drawerstate.setState(true)} 
        aira-label="add to shopping cart"
      >
        <AddShoppingCartIcon fontSize="large"/>
      </IconButton>
      <Drawer
        anchor="right"
        open={drawerstate.state}
      >
      <SideList drawerstate={drawerstate} selection={selection} size={size} user={user}/>
      </Drawer>
    </div>
  );
};

const SideList = ({drawerstate,selection,size,user}) => {
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
      <IconButton aira-label="shopping cart" disabled={true}>
        <ShoppingCartIcon className={classes.cartbutton} fontSize="large"/>
      </IconButton>
      </Grid>
    </Grid>
    <Divider/>
    <ShoppingList selection={selection} size={size} user={user}/>
    </div>
  );
};

const ShoppingList = ({selection,size,user}) => {
  let total = 0;
  if(selection.selected.length>=1){
    selection.selected.forEach(item=>total=total+item[item.size]*item.price);
  }
  const classes = useStyles(total);

  useEffect(() => {
    const notification = () => {
      selection.selected.forEach(item => {
        if(size[item.sku][item.size]===0){
          alert(`The item ${item.title} you selected is unavailable, please remove it`)
          item[item.size]=0;
        }
        else if(item[item.size]>size[item.sku][item.size]) {
          alert(`The amount of the item ${item.title} you selected exceeds the available amount, because someone bought it, so it is adjusted to the maximum amount.`)
          item[item.size]=size[item.sku][item.size];
        }
      })
      if(user){
        firebase.database().ref().child('carts/'+user.uid).set(selection.selected)
      }
      selection.setSelected([...selection.selected])
    }
    notification();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[size.checkout])

  return(
    <React.Fragment>
    <div className={classes.shoppinglist}>
    {selection.selected.map(item => 
    <Card key={item.sku+item.size} className={classes.card}>
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
      Size: {item.size}
    </Typography>
    <Typography variant="caption">
      {item.currencyFormat}{item.price} 
    </Typography>
    <Typography variant="caption">
      Quantity: {item[item.size]}
    </Typography>
    </CardContent>
    <div className={classes.clearbutton}>
    <IconButton 
        size="small" 
        onClick={()=>selection.deleteToggle(item,item.size,user)}
    >
        <ClearIcon fontSize="small"/>
    </IconButton>
    <div className={classes.adjustbutton}>
    <IconButton 
        className={classes.addbutton} 
        size="small" 
        disabled={item[item.size]>=size[item.sku][item.size]} 
        onClick={()=>selection.addToggle(item,item.size,user)}
    >
        <AddIcon fontSize="small"/>
    </IconButton>
    <IconButton 
        size="small" 
        disabled={item[item.size]<=1} 
        onClick={()=>selection.decreaseToggle(item,item.size,user)}
    >
        <RemoveIcon fontSize="small"/>
    </IconButton>
    </div>
    </div>
    </Card>
    )}
    </div>
    <Divider/>
    <div className={classes.checkout}>
    <Typography variant="h6" className={classes.checkoutprice}>
      SUBTOTAL                      
    </Typography>
    <Typography variant="h6">
      ${total.toFixed(2)}                 
    </Typography>
    </div>
    <Button 
      disabled={total===0}
      className={classes.checkoutbutton} 
      onClick={()=>{
        alert(`Checkout - Subtotal: $ ${total.toFixed(2)}`)
        selection.selected.forEach(item=>{
          firebase.database().ref().child(item.sku).transaction(amount=>{return {...amount, [item.size]:size[item.sku][item.size]-item[item.size]}})
        })
        selection.setSelected([]);
        if(user){firebase.database().ref().child('carts/'+user.uid).set([])}
        firebase.database().ref().child('checkout').transaction(value=>!value);
        }}
    >
      Checkout
    </Button>
    </React.Fragment>
  );
};

export default Cart;