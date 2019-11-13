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
  const addToggle = (item,si,user) => {
    if (selected.some(x=>x.sku===item.sku&&x.size===si)) {
      let pos = selected.findIndex(x=>x.sku===item.sku&&x.size===si);
      selected[pos]={...selected[pos], [si]:selected[pos][si]+1}
      setSelected(selected);
      if(user){
        firebase.database().ref().child('carts/'+user.uid).set(selected);
      }
    }
    else{
      let quan = {size:si,[si] : 1}
      let temp = selected.concat([Object.assign(quan, item)])
      setSelected(temp);
      if(user){
        firebase.database().ref().child('carts/'+user.uid).set(temp);
      }
    }
  }
  const deleteToggle = (item,si,user) => {
    let temp = selected.filter(x=>x.sku!==item.sku||x.size!==si);
    setSelected(temp);
    if(user){
      firebase.database().ref().child('carts/'+user.uid).set(temp);
    }
  }
  const decreaseToggle = (item,si,user) =>{
    let pos = selected.findIndex(x=>x.sku===item.sku&&x.size===si);
    if(selected[pos][si]>1){
      selected[pos]={...selected[pos], [si]:selected[pos][si]-1}
      setSelected(selected);
      if(user){
        firebase.database().ref().child('carts/'+user.uid).set(selected);
      }
    }
  }
  return [selected,setSelected,addToggle,deleteToggle,decreaseToggle];
}

const App = () => {
  const [data, setData] = useState([]);
  const [state, setState] = useState(false);
  const [selected, setSelected, addToggle, deleteToggle, decreaseToggle] = useSelection();
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
    <Appbar drawerstate={{state, setState}} selection={{selected,setSelected,addToggle,deleteToggle,decreaseToggle}} size={size} user={user}/>
    <ProductList products={data} drawerstate={{state,setState}} selection={{selected,addToggle}} size={size} user={user}/>
  </React.Fragment>
  );
};

export default App;