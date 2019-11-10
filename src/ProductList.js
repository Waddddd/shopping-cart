import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Product from './Product'

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      display: "flex",
      flexWrap: "wrap",
      marginTop:10,
      position:"relative"
    },
  }));

const ProductList =({products,drawerstate,selection,size}) => {
    const classes = useStyles();
    return(
      <Grid container spacing={2} className={classes.root}>       
        {products.map(product => 
        <Grid item xs={3} key={product.sku}>
        <Product product={product} drawerstate={drawerstate} selection={selection} size={size}/>
      </Grid>
      )}
      </Grid>
    );
  };

export default ProductList;