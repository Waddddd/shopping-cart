import React,{useState,useEffect,useLayoutEffect} from 'react'
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
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import firebase from 'firebase/app';
import 'firebase/database';

const useStyles = makeStyles({
  list: {
    width: 380,
  },
  shoppinglist:{
    height: props=>props.height-190,
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
    textAlign:'center',
  },
  checkoutbuttonself:{
    marginTop:10,
    fontSize:20,
    width:350,
    backgroundColor: props=>props.totalCost?'indigo':'white',
    color:'white',
    '&:hover':{backgroundColor:'black'}
  }
});

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

const Cart = ({drawerstate,selection,size,user}) => {
  // eslint-disable-next-line no-unused-vars
  const [width, height] = useWindowSize();
  let totalNum = 0;
   if(selection.selected.length>=1){
     selection.selected.forEach(item=>totalNum=totalNum+item[item.size]);
   }

  return(
    <div>
      <IconButton 
        color="inherit" 
        onClick={() => drawerstate.setState(true)} 
        aira-label="add to shopping cart"
      >
        <Badge badgeContent={totalNum} color='secondary'>
        <AddShoppingCartIcon fontSize="large"/>
        </Badge>
      </IconButton>
      <Drawer
        anchor="right"
        open={drawerstate.state}
      >
      <SideList drawerstate={drawerstate} selection={selection} size={size} user={user} totalNum={totalNum} height={height}/>
      </Drawer>
    </div>
  );
};

const SideList = ({drawerstate,selection,size,user,totalNum,height}) => {
  const classes = useStyles(height);
  
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
        <Badge badgeContent={totalNum} color='secondary'>
        <ShoppingCartIcon className={classes.cartbutton} fontSize="large"/>
        </Badge>
      </IconButton>
      </Grid>
    </Grid>
    <Divider/>
    <ShoppingList selection={selection} size={size} user={user} height={height}/>
    </div>
  );
};

const ShoppingList = ({selection,size,user,height}) => {
  let totalCost = 0;
  if(selection.selected.length>=1){
    selection.selected.forEach(item=>totalCost=totalCost+item[item.size]*item.price);
  }
  const classes = useStyles({totalCost,height});

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
      ${totalCost.toFixed(2)}                 
    </Typography>
    </div>
    <div className={classes.checkoutbutton}>
    <Button 
      disabled={totalCost===0}
      className={classes.checkoutbuttonself} 
      onClick={()=>{
        alert(`Checkout - Subtotal: $ ${totalCost.toFixed(2)}`)
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
    </div>
    </React.Fragment>
  );
};

export default Cart;