import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ProductList from './ProductList';
import Cart from './Cart'

const SizeBar = () =>{
  return(
  <React.Fragment>
  <Typography align="left" variant="h5" >
  size:
  </Typography>
  <Button size="small" variant="outlined" color="primary">
    S
  </Button>
  <Button size="small" variant="outlined" color="primary">
    M
  </Button>
  <Button size="small" variant="outlined" color="primary">
    L
  </Button>
  <Button size="small" variant="outlined" color="primary">
    XL
  </Button>
  </React.Fragment>
  );
};

const useSelection = () => {
  const [selected,setSelected] = useState([]);
  const addToggle = (item) => {
    if (selected.some(x=>x.sku===item.sku)) {
      console.log("come include")
      let pos = selected.findIndex(x=>x.sku===item.sku);
      selected[pos]={...selected[pos], quantity:selected[pos].quantity+1}
      console.log(selected[pos]);
      setSelected(selected);
    }
    else{
      console.log("come exclude")
      let quan = {quantity : 1}
      setSelected(selected.concat([Object.assign(item, quan)]));
    }
  }
  const deleteToggle = (item) => {
    setSelected(selected.filter(x=>x!==item));
  }
  const decreaseToggle = (item) =>{
    let pos = selected.findIndex(x=>x.sku===item.sku);
    if(selected[pos].quantity>1){
      selected[pos]={...selected[pos], quantity:selected[pos].quantity-1}
      console.log(selected[pos]);
      setSelected(selected);
    }
  }
  return [selected,addToggle,deleteToggle,decreaseToggle];
}

const App = () => {
  const [data, setData] = useState([]);
  const [state, setState] = useState(false);
  const [selected,addToggle,deleteToggle,decreaseToggle] = useSelection();

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const json = await response.json();
      setData(Object.values(json));
    };
    fetchProducts();
  }, []);

  return (
  <React.Fragment>
    <Grid container>
      <Grid item xs={11}>
      </Grid>
      <Grid item xs={1}>
        <Cart drawerstate={{state, setState}} selection={{selected,addToggle,deleteToggle,decreaseToggle}} />
      </Grid>
    </Grid>
      <Grid item xs={2}>
        <SizeBar />
      </Grid>
    <ProductList products={data} drawerstate={{state,setState}} selection={{selected,addToggle}}/>
  </React.Fragment>
  );
};

export default App;