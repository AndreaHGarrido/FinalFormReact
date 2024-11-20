import React, { useState, useEffect } from 'react';
import './App.css';
import { Form, Field } from 'react-final-form';
import { Button, FormControl, InputLabel, Input, Typography} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InfoIcon from '@mui/icons-material/Info';
import Table from './components/Table'; 
import productSchema from './validations/zodValidations'; // Importa el esquema de validación

// array de objetos/productos
const itemsData = [
  { id: 1, name: "Manzanas", price: 12.5 },
  { id: 2, name: "Suavitel", price: 28.5 },
  { id: 3, name: "Leche", price: 22.0 },
  { id: 4, name: "Salchichas", price: 30.0 },
  { id: 5, name: "Huevos", price: 7.5 },
  { id: 6, name: "Nuggets", price: 45.0 },
  { id: 7, name: "Servitoallas", price: 45.0 }
];

const App = () => {
  const [items, setItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCount, setSelectedCount] = useState("");
  const [isAddEnabled, setIsAddEnabled] = useState(false);
  const [showProductsPopup, setShowProductsPopup] = useState(false);

  const onSubmit = (values) => {
    const selectedProductData = itemsData.find(item => item.name.toLowerCase() === values.item.toLowerCase());
    if (selectedProductData) {
      const newProduct = {
        id: selectedProductData.id,
        name: selectedProductData.name,
        price: selectedProductData.price,
        count: Number(values.count)
      };
      setItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === newProduct.id);
        if (existingItem) {
          return prevItems.map(item => 
            item.id === newProduct.id 
              ? { ...item, count: item.count + newProduct.count }
              : item 
          );
        }
        return [...prevItems, newProduct]; 
      });
      
      // Limpiar los campos después de agregar el producto
      setSelectedCount("");
      setSelectedProduct(null);
    }
  };

  const validate = async (values) => {
    try {
      await productSchema.parseAsync(values);
      return {}; // Si la validación es exitosa, devuelve un objeto vacío
    } catch (error) {
      return error.errors.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message; // Mapea los errores a sus respectivos campos
        return acc;
      }, {});
    }
  };

  const total = items.reduce((acc, item) => acc + (item.price * item.count), 0);

  // Efecto para habilitar el botón "Agregar"
  useEffect(() => {
    // El botón se habilita si hay un producto seleccionado y una cantidad válida
    setIsAddEnabled(Boolean(selectedProduct && selectedCount && !isNaN(selectedCount) && Number(selectedCount) > 0)); 
  }, [selectedProduct, selectedCount]);

  // Función para eliminar todos los productos y limpiar los campos
  const handleClearAll = () => {
    setItems([]); // Vaciar la tabla
    setSelectedCount(""); // Limpiar el campo de cantidad
    setSelectedProduct(null); // Limpiar el producto seleccionado
  };

  return (
    <div className="app-container">
      <Typography variant="h4" gutterBottom>
        Supermercado
      </Typography>
      <Form
        onSubmit={onSubmit}
        validate={validate} // Agrega la función de validación aquí
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <FormControl style={{ marginRight: '20px', minWidth: 250 }}>
              <InputLabel htmlFor="product-input">Nombre del producto</InputLabel>
              <Field name="item">
                {({ input }) => (
                  <Input
                    {...input}
                    type="text"
                    onChange={(e) => {
                      input.onChange(e);
                      const productName = e.target.value;
                      const product = itemsData.find(item => item.name.toLowerCase() === productName.toLowerCase());
                      setSelectedProduct(product || null); // Actualiza el producto seleccionado
                    }}
                  />
                )}
              </Field>
            </FormControl>
            <FormControl style={{ marginRight: '20px', minWidth: 250 }}>
              <InputLabel htmlFor="count-input">Cantidad</InputLabel>
              <Field name="count">
                {({ input }) => (
                  <Input
                    {...input}
                    id="count-input"
                    type="number"
                    onChange={(e) => {
                      input.onChange(e);
                      setSelectedCount(e.target.value); // Actualiza la cantidad seleccionada
                    }}
                  />
                )}
              </Field>
            </FormControl>
            <Button 
              type="submit" 
              variant="contained" 
              style={{
                backgroundColor: isAddEnabled ? '' : 'gray', 
                color: 'white'
              }}
              disabled={!isAddEnabled}
            >
              Agregar
            </Button>

            {/* Botón para eliminar todo */}
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={handleClearAll} 
              style={{ marginLeft: '20px' }}
            >
              Eliminar Todo
            </Button>

            {/* Icono para mostrar la lista de productos */}
            <div style={{ display: 'inline-block', marginLeft: '20px', position: 'relative' }}>
              <InfoIcon 
                onMouseEnter={() => setShowProductsPopup(true)} 
                onMouseLeave={() => setShowProductsPopup(false)} 
                style={{ cursor: 'pointer' }} 
              />
              {showProductsPopup && (
                <div style={{
                  position: 'absolute',
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  padding: '10px',
                  zIndex: 1000,
                  boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {itemsData.map(product => (
                    <div key={product.id} style={{ marginBottom: '5px' }}>
                      {product.name}: ${product.price.toFixed(2)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        )}
      />

      {/* Usando el nuevo componente de tabla */}
      <Table
        columns={[
          {
            accessorKey: 'name',
            header: 'Producto',
            Cell: ({ cell }) => (
              <>
                <ShoppingCartIcon style={{ marginRight: '8px' }} />
                {cell.getValue()}
              </>
            ),
          },
          {
            accessorKey: 'price',
            header: 'Precio',
            Cell: ({ cell }) => `$${cell.getValue().toFixed(2)}`,
          },
          {
            accessorKey: 'count',
            header: 'Cantidad',
          },
        ]}
        data={items}
      />

      <Typography 
        variant="h6" 
        style={{ marginTop: '20px', textAlign: 'right' }}
      >
        Total: ${total.toFixed(2)}
      </Typography>
    </div>
  );
};

export default App;