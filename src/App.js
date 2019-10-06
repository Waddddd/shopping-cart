import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import CloseIcon from '@material-ui/icons/Close'
import Divider from '@material-ui/core/Divider'

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(0.3),
  },
  list: {
    width: 400
  },
}));

const ProductList =({products,state}) => {
  
  return(

  <GridList cellHeight={"auto"} cols={4}>
      {products.map(product => 
      <Card key={product.sku} style={{maxWidth:250}}>
      <CardActionArea>
        <CardMedia
          component="img"
          image={"data/products/"+product.sku+"_1.jpg"}
        />
        <CardContent>
          <Typography align="center">
            {product.title}
          </Typography>
          <Typography align="center">
            {product.currencyFormat}{product.price}
          </Typography>
        </CardContent>
        <CardActions>
        <Button size="small" color="primary" onClick={() => state.setState(true)}>
          Add to cart
        </Button>
      </CardActions>
      </CardActionArea>
    </Card>
    )}
  </GridList>

  );
};

const CartButtom = ({state,classes}) => {

  const sideList = () => {
    return(
      <div
        className={classes.list}
      >
      <Grid container>
        <Grid item xs={5}>
        <IconButton onClick={() => state.setState(false)} aira-label="close shopping cart">
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
      </div>
    );
  };

  return(
    <div>
      <IconButton color="primary" onClick={() => state.setState(true)} aira-label="add to shopping cart">
        <AddShoppingCartIcon fontSize="large"/>
      </IconButton>
      <Drawer
        anchor="right"
        open={state.state}
      >
        {sideList()}
      </Drawer>
    </div>
  );
};

const SizeBar = ({classes}) =>{
  return(
  <React.Fragment>
  <Typography align="left" variant="h5" >
  size:
  </Typography>
  <Button size="small" variant="outlined" color="primary" className={classes.button}>
    S
  </Button>
  <Button size="small" variant="outlined" color="primary" className={classes.button}>
    M
  </Button>
  <Button size="small" variant="outlined" color="primary" className={classes.button}>
    L
  </Button>
  <Button size="small" variant="outlined" color="primary" className={classes.button}>
    XL
  </Button>
  </React.Fragment>
  );
};

const App = () => {
  const [data, setData] = useState({});
  const [state, setState] = useState(false);
  const products = Object.values(data);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const json = await response.json();
      setData(json);
    };
    fetchProducts();
  }, []);

  const classes = useStyles();

  return (
  <React.Fragment>
    <Grid container>
      <Grid item xs={11} justify="flex-end">
      
      </Grid>
      <Grid item xs={1} justify="flex-end">
        <CartButtom state={{state, setState}} classes={classes}/>
      </Grid>
    </Grid>
    <Grid container> 
      <Grid item xs={2}>
        <SizeBar classes={classes}/>
      </Grid>
      <Grid item xs={10}>
        <ProductList products={products} state={{state,setState}} />
      </Grid>
    </Grid>
  </React.Fragment>
  );
};

export default App;