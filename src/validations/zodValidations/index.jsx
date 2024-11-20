// validation.js
import { z } from 'zod';

// Esquema de validación para el formulario
const productSchema = z.object({
  item: z.string()
    .min(5, "El nombre del producto debe tener al menos 5 letras.")
    .regex(/^[^\s]+$/, "El nombre del producto no debe contener espacios.")
    .regex(/^[a-zA-Z0-9]+$/, "El nombre del producto no debe contener caracteres especiales."),
  count: z.coerce.number() // Coerce a número automáticamente
    .min(1, "La cantidad debe ser al menos 1.")
});

// Exportar el esquema para usarlo en otros archivos
export default productSchema;