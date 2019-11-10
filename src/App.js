import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import ProductList from './ProductList';
import Cart from './Cart'

const useSelection = () => {
  const [selected,setSelected] = useState([]);
  const addToggle = (item,si) => {
    if (selected.some(x=>x.sku===item.sku&&x.size===si)) {
      console.log("come include")
      let pos = selected.findIndex(x=>x.sku===item.sku&&x.size===si);
      selected[pos]={...selected[pos], [si]:selected[pos][si]+1}
      console.log(selected[pos]);
      setSelected(selected);
    }
    else{
      console.log("come exclude")
      let quan = {size:si,[si] : 1}
      setSelected(selected.concat([Object.assign(quan, item)]));
    }
  }
  const deleteToggle = (item,si) => {
    setSelected(selected.filter(x=>x.sku!==item.sku||x.size!==si));
  }
  const decreaseToggle = (item,si) =>{
    let pos = selected.findIndex(x=>x.sku===item.sku&&x.size===si);
    if(selected[pos][si]>1){
      selected[pos]={...selected[pos], [si]:selected[pos][si]-1}
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
  const [size,setSize] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      const responseData = await fetch('./data/products.json');
      const resData = await responseData.json();
      const responseSize = await fetch('./data/inventory.json')
      const resSize = await responseSize.json();
      setData(Object.values(resData));
      setSize(resSize);
    };
      fetchProducts();
  }, []);

  return (
  <React.Fragment>
    <Grid container>
      <Grid item xs={11}>
      </Grid>
      <Grid item xs={1}>
        <Cart drawerstate={{state, setState}} selection={{selected,addToggle,deleteToggle,decreaseToggle}} size={size}/>
      </Grid>
    </Grid>
    <ProductList products={data} drawerstate={{state,setState}} selection={{selected,addToggle}} size={size}/>
  </React.Fragment>
  );
};

export default App;