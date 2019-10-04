import React, { useEffect, useState } from 'react';
import GridList from '@material-ui/core/GridList';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const App = () => {
  const [data, setData] = useState({});
  const products = Object.values(data);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const json = await response.json();
      setData(json);
    };
    fetchProducts();
  }, []);

  
    const [state, setState] = React.useState({
      checked1: false,
      checked2: false,
      checked3: false,
      checked4: false,
      checked5: false,
      checked6: false,
      checked7: false,
    });
  
  const handleChange = name => event => {
      setState({ ...state, [name]: event.target.checked });
    };

  return (
      <div> 
        <FormControlLabel
        control={
          <Checkbox
            checked={state.checked1}
            onChange={handleChange('checked1')}
            value="checked1"
            color="primary"
          />
        }
        label="XS"
      />
       <FormControlLabel
        control={
          <Checkbox
            checked={state.checked2}
            onChange={handleChange('checked2')}
            value="checked2"
            color="primary"
          />
        }
        label="S"
      />
       <FormControlLabel
        control={
          <Checkbox
            checked={state.checked3}
            onChange={handleChange('checked3')}
            value="checked3"
            color="primary"
          />
        }
        label="M"
      />
       <FormControlLabel
        control={
          <Checkbox
            checked={state.checked4}
            onChange={handleChange('checked4')}
            value="checked4"
            color="primary"
          />
        }
        label="ML"
      />
       <FormControlLabel
        control={
          <Checkbox
            checked={state.checked5}
            onChange={handleChange('checked5')}
            value="checked5"
            color="primary"
          />
        }
        label="L"
      />
       <FormControlLabel
        control={
          <Checkbox
            checked={state.checked6}
            onChange={handleChange('checked6')}
            value="checked6"
            color="primary"
          />
        }
        label="XL"
      />
       <FormControlLabel
        control={
          <Checkbox
            checked={state.checked7}
            onChange={handleChange('checked7')}
            value="checked7"
            color="primary"
          />
        }
        label="XXL"
      />
      <GridList cellHeight={"auto"} cols={5} spacing={2}>
      {products.map(product => 
      <Card key={product.sku} style={{maxWidth:400}}>
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
        <Button size="small" color="primary" align="center">
          Add to cart
        </Button>
      </CardActions>
      </CardActionArea>
    </Card>
    )}
      </GridList>
      </div>
  );
};

export default App;