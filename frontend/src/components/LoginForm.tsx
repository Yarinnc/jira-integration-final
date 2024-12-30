import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authenticateUser } from '../api/jiraApi';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authenticateUser(email, apiKey);
      navigate('/create-ticket');
    } catch (err) {
      console.error(err);
      setError('Invalid credentials');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          width: {
            xs: '90%',
            sm: '400px',
          },
          padding: {
            xs: '20px',
            sm: '32px',
          },
          backgroundColor: 'white',
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: 1,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            marginBottom: '24px',
            fontWeight: 600,
            color: 'black',
          }}
        >
          Login
        </Typography>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="API Token"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        {error && (
          <Alert severity="error" sx={{ marginTop: '16px' }}>
            {error}
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            marginTop: '24px',
            padding: '12px 0',
            fontSize: '16px',
            fontWeight: 600,
          }}
          fullWidth
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default LoginForm;
