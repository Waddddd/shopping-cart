import React,{useState} from 'react'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover'
import { makeStyles } from '@material-ui/core/styles';

const sizechart = ['S','M','L','XL']

const useStyles = makeStyles(theme => ({
    root: {
        display:'flex',
        flexDirection:'column',
    },
  }));

const SizeSelection = ({product,setAnchorEl,setSelectedsize,size}) => {
    return(
    sizechart.map(si=>
      <Button
      key={si}
      disabled={size[product.sku][si]===0} 
      onClick={()=>{
        setSelectedsize(si);
        setAnchorEl(null);
      }}
      >
        {si}
      </Button>
    )
    )     
}

const Product = ({product,drawerstate,selection,size,user}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedsize, setSelectedsize] = useState('Open Size Chart');
    const open = Boolean(anchorEl);
    const classes = useStyles();

    return(
        <Card>
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
          <Button onClick={(e)=>{setAnchorEl(e.target)}}>
              {selectedsize}
          </Button>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={()=>{setAnchorEl(null);}}
            anchorOrigin={{
                vertical:'bottom',
                horizontal:'center'
            }}
            transformOrigin={{
                vertical:'top',
                horizontal:'center'
            }}
          >
          <SizeSelection product={product} setAnchorEl={setAnchorEl} setSelectedsize={setSelectedsize} size={size}/>
          </Popover>
          <Button 
            size="small" 
            color="primary" 
            className={classes.button} 
            disabled={(selectedsize!=='Open Size Chart'&&size[product.sku][selectedsize]===0)||selection.selected.some(x=>x.sku===product.sku&&x.size===selectedsize&&x[selectedsize]>=size[product.sku][selectedsize])}
            onClick={(e)=>{
                if(selectedsize==='Open Size Chart'){
                    setAnchorEl(e.target);
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