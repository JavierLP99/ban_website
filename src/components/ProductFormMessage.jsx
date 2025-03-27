import React, { useState } from "react";
import { TextField, Box } from "@mui/material";

const ProductFormMessage = () => {
  const [focusPrice, setFocusPrice] = useState(false);

  return (
    <Box>
      {/* Floating Label for Price */}
      <Box position="relative" mb={2}>
        {focusPrice && (
          <Box
            position="absolute"
            top={-25}
            left={10}
            bgcolor="white"
            px={1}
            py={0.5}
            borderRadius={1}
            boxShadow={1}
          >
            Enter the price of the product
          </Box>
        )}
        <TextField
          label="Price"
          variant="outlined"
          type="number"
          onFocus={() => setFocusPrice(true)}
          onBlur={() => setFocusPrice(false)}
          fullWidth
        />
      </Box>

      {/* Other fields for the form */}
      <TextField
        label="Product Name"
        variant="outlined"
        fullWidth
        margin="normal"
      />
    </Box>
  );
};

export default ProductFormMessage;
