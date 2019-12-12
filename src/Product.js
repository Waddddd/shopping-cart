import React,{ useState, useRef } from 'react'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover'
import { makeStyles } from '@material-ui/core/styles';

const sizechart = ['S','M','L','XL']

const useStyles = makeStyles({
    root: {
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
    },
    card: {
      width: 300,
      height: 600
    },
    addbutton:{
      backgroundColor:'indigo',
      color:'white',
      width:250,
      '&:hover':{backgroundColor:'black'}
    },
    sizebutton:{
      width:250,
      color:'indigo',
      '&:hover':{backgroundColor:'white'}
    },
    outofstockbutton:{
      width:250,
      backgroundColor:'orange'
    }
  });

const SizeSelection = ({product,setAnchorEl,setSelectedsize,size,selection}) => {
    const classes = useStyles();

    return(
    (Object.keys(size).length !== 0&&size[product.sku]['S']===0&&size[product.sku]['M']===0&&size[product.sku]['L']===0&&size[product.sku]['XL']===0)?
    <Button className={classes.outofstockbutton} disabled={true}>Out of Stock</Button>:
    sizechart.map(si=>
      <Button
      key={si}
      disabled={size[product.sku][si]===0||selection.selected.some(x=>x.sku===product.sku&&x.size===si&&x[si]>=size[product.sku][si])} 
      onClick={()=>{
        setSelectedsize(si);
        setAnchorEl(false);
      }}
      >
        {si}
      </Button>
    )
    ) 
}

const Product = ({product,drawerstate,selection,size,user}) => {
    const [anchorEl, setAnchorEl] = useState(false);
    const [selectedsize, setSelectedsize] = useState('Open Size Chart');
    const popover = useRef();
    const classes = useStyles();
    
    return(
        <Card className={classes.card}>
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
          <div className={classes.root}>
          <Button 
            className={classes.sizebutton}
            ref={popover} 
            onClick={()=>setAnchorEl(true)}
          >
            {selectedsize}
          </Button>
          <Popover
            open={anchorEl}
            anchorEl={popover.current}
            onClose={()=>setAnchorEl(false)}
            anchorOrigin={{
                vertical:'top',
                horizontal:'center'
            }}
            transformOrigin={{
                vertical:'top',
                horizontal:'center'
            }}
          >
          <SizeSelection product={product} setAnchorEl={setAnchorEl} setSelectedsize={setSelectedsize} size={size} selection={selection}/>
          </Popover>
          <Button 
            className={classes.addbutton}
            disabled={(selectedsize!=='Open Size Chart'&&size[product.sku][selectedsize]===0)||selection.selected.some(x=>x.sku===product.sku&&x.size===selectedsize&&x[selectedsize]>=size[product.sku][selectedsize])}
            onClick={()=>{
                if(selectedsize==='Open Size Chart'){
                    setAnchorEl(true);
                }
                else{
                    drawerstate.setState(true);
                    selection.addToggle(product,selectedsize,user);
                }
            }}
          >
            Add to cart
          </Button>
          </div>
      </Card>
    )
}

export default Product;