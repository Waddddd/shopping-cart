import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Product from './Product'

const useStyles = makeStyles({
    root: {
      marginTop:10,
    },
  });

const ProductList =({products,drawerstate,selection,size,user}) => {
    const classes = useStyles();
    return(
      <Grid container className={classes.root} spacing={2} justify={"space-around"}>       
        {products.map(product => 
        <Grid item key={product.sku}>
        <Product product={product} drawerstate={drawerstate} selection={selection} size={size} user={user}/>
        </Grid>
      )}
      </Grid>
    );
  };

export default ProductList;