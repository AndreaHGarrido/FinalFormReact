import React, { useState, useEffect } from 'react';
import './App.css';
import { Form, Field } from 'react-final-form';
import { Button, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { MaterialReactTable } from 'material-react-table'; 

// array de objetos/productos
const itemsData = [
  { id: 1, name: "Manzanas", price: 12.5 },
  { id: 2, name: "Plátanos", price: 8.5 },
  { id: 3, name: "Leche", price: 22.0 },
  { id: 4, name: "Pan", price: 30.0 },
  { id: 5, name: "Huevos", price: 7.5 },
  { id: 6, name: "Nuggets", price: 45.0 }
];

const App = () => {
  const [items, setItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCount, setSelectedCount] = useState("");
  const [isCountEnabled, setIsCountEnabled] = useState(false);
  const [isAddEnabled, setIsAddEnabled] = useState(false);

  const onSubmit = (values) => {
    const selectedProduct = itemsData.find(item => item.id === Number(values.item));
    if (selectedProduct) {
      const newProduct = {
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        count: Number(values.count)
      };
      setItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === newProduct.id);
        if (existingItem) {
          // .map() para crear un nuevo array basado en prevItems
          return prevItems.map(item => 
            item.id === newProduct.id // si el id del item actual es igual al id del newProduct
              ? { ...item, count: item.count + newProduct.count } // sintaxis de "spread" para crear una copia del objeto item existente.
              : item // devuelve el item sin cambios si no coincide
          );
        }
        // crea un nuevo array que incluye todos los elementos existentes en prevItems más el newProduct
        return [...prevItems, newProduct]; 
      });
      
      // Resetea los campos cuando 
      setSelectedProduct(null);
      setSelectedCount("");
      setIsAddEnabled(false);
    }
  };

  // Reduce en JavaScript permite reducir todos los elementos de un array a un único valor.
  const total = items.reduce((acc, item) => acc + (item.price * item.count), 0);

  useEffect(() => {
    if (selectedProduct) {
      setIsCountEnabled(true); // Habilita el selector de cantidad
      setSelectedCount(""); // Restablece el selector de cantidad
    } else {
      setIsCountEnabled(false); // Desactiva el selector de cantidad
    }
    setIsAddEnabled(false); // Desactiva el botón 
  }, [selectedProduct]);
  
  // Activa el botón cuando ambos están seleccionados 
  useEffect(() => {
    setIsAddEnabled(Boolean(selectedProduct && selectedCount)); 
  }, [selectedProduct, selectedCount]);

  return (
    <div className="app-container">
      <Typography variant="h4" gutterBottom>
        Supermercado
      </Typography>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <FormControl style={{ marginRight: '20px', minWidth: 250 }}>
              <InputLabel id="select-product-label">Selecciona un producto</InputLabel>
              <Field name="item">
                {({ input }) => (
                  <Select 
                    {...input} 
                    labelId="select-product-label" 
                    displayEmpty 
                    onChange={(e) => {
                      input.onChange(e);
                      setSelectedProduct(e.target.value);
                    }}
                  >
                    {itemsData.map(item => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </Field>
            </FormControl>
            <FormControl style={{ marginRight: '20px', minWidth: 250 }}>
              <InputLabel id="select-count-label">Selecciona una cantidad</InputLabel>
              <Field name="count">
                {({ input }) => (
                  <Select 
                    {...input} 
                    labelId="select-count-label" 
                    displayEmpty 
                    disabled={!isCountEnabled} // Disable hasta que el producto está seleccionado
                    value={selectedCount} // Setea el valor al state de selectedCount
                    onChange={(e) => {
                      input.onChange(e);
                      setSelectedCount(e.target.value);
                    }}
                  >
                    {[1, 2, 3, 4, 5].map(count => (
                      <MenuItem key={count} value={count}>
                        {count}
                      </MenuItem>
                    ))}
                  </Select>
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
              disabled={!isAddEnabled} // boton inhabilitado hasta que ambos selects estén activos
            >
              Agregar
            </Button>
          </form>
        )}
      />

      {/* Usando Material React Table */}
      <MaterialReactTable
        columns={[
          {
            accessorKey: 'name', // clave del objeto que se mostrará en la columna
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
        data={items} // datos que se mostrarán en la tabla
        enableColumnOrdering // habilita el ordenamiento de columnas
        enableSorting // habilita el ordenamiento de filas
        initialState={{ showGlobalFilter: true }} // muestra el filtro global por defecto
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