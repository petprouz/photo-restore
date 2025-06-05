import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ErrorProps {
  message: string;
  title?: string;
}

const Error: React.FC<ErrorProps> = ({ message, title = 'Error' }) => {
  return (
    <Box sx={{ width: '100%', my: 2 }}>
      <Alert
        severity="error"
        icon={<ErrorOutlineIcon />}
        sx={{
          '& .MuiAlert-icon': {
            fontSize: 24
          }
        }}
      >
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
};

export default Error; 