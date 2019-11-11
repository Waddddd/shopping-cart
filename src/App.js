import React, { useEffect, useState } from 'react';
import ProductList from './ProductList';
import Appbar from './Appbar'
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB7NVrnxvMVO2HCPqfnxQrHe4RrM2-iU5g",
  authDomain: "shopping-cart-e624d.firebaseapp.com",
  databaseURL: "https://shopping-cart-e624d.firebaseio.com",
  projectId: "shopping-cart-e624d",
  storageBucket: "shopping-cart-e624d.appspot.com",
  messagingSenderId: "956656881714",
  appId: "1:956656881714:web:1b1ddd0dacb9525be62c2b"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();

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
  const [selected, addToggle, deleteToggle, decreaseToggle] = useSelection();
  const [size, setSize] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const responseData = await fetch('./data/products.json');
      const resData = await responseData.json();
      setData(Object.values(resData));
      const handleData = snap => {
        if(snap.val()) {setSize(snap.val());}
      }
        db.on('value', handleData, error => alert(error));
        return () => {db.off('value', handleData)};
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  return (
  <React.Fragment>
    <Appbar drawerstate={{state, setState}} selection={{selected,addToggle,deleteToggle,decreaseToggle}} size={size} user={user}/>
    <ProductList products={data} drawerstate={{state,setState}} selection={{selected,addToggle}} size={size}/>
  </React.Fragment>
  );
};

export default App;