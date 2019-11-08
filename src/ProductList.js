import React from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      display: "flex",
      flexWrap: "wrap",
      marginTop:10,
      position:"relative"
    },
    button: {
      margin: theme.spacing(0.3),
      marginLeft: 105,
    },
  }));

const ProductList =({products,drawerstate,selection}) => {
    const classes = useStyles();
    return(
      <Grid container spacing={2} className={classes.root}>       
        {products.map(product => 
        <Grid item xs={3} key={product.sku}>
        <Card>
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
          <Button size="small" color="primary" className={classes.button}
            onClick={()=>{
              drawerstate.setState(true);
              selection.addToggle(product);
            }}
          >
            Add to cart
          </Button>
        </CardActions>
        </CardActionArea>
      </Card>
      </Grid>
      )}
      </Grid>
    );
  };

export default ProductList;