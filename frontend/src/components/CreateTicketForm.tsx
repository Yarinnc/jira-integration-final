import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { isEmpty } from 'lodash';
import OwnerAutocomplete from './OwnerAutocomplete';
import { createIssue } from '../api/jiraApi';
import { FormData, InputField, JiraUser } from '../types/types';

const CreateTicketForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    projectId: '',
    title: '',
    description: '',
    occurrences: '',
    owner: '',
  });

  const [issueUrl, setIssueUrl] = useState('');
  const [error, setError] = useState('');

  const inputs: InputField[] = [
    { name: 'projectId', label: 'Enter your project ID', type: 'text' },
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'description', label: 'Description', type: 'text' },
    { name: 'occurrences', label: 'Occurrences', type: 'number' },
  ];

  const isFormValid = Object.values(formData).every((value) => !isEmpty(value));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOwnerChange = (value: JiraUser | null) => {
    setFormData((prev) => ({
      ...prev,
      owner: value?.accountId || '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        occurrences: parseInt(formData['occurrences']),
      };

      const { issueLink } = await createIssue(payload);
      setIssueUrl(issueLink);
    } catch (err) {
      console.error(err);
      setError('Failed to create ticket');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: {
          xs: '100%',
          sm: '600px',
        },
        backgroundColor: 'white',
        padding: {
          xs: 2,
          sm: 4,
        },
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: 'black', fontWeight: 600 }}
      >
        Create Jira Ticket
      </Typography>
      {inputs.map((input) => (
        <TextField
          key={input.name}
          label={input.label}
          name={input.name}
          type={input.type}
          value={formData[input.name]}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
      ))}
      <OwnerAutocomplete
        onError={setError}
        value={formData.owner}
        onChange={handleOwnerChange}
      />
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? <CircularProgress /> : 'Create Ticket'}
      </Button>
      {issueUrl && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Ticket created:{' '}
          <a href={issueUrl} target="_blank" rel="noopener noreferrer">
            {issueUrl}
          </a>
        </Alert>
      )}
    </Box>
  );
};

export default CreateTicketForm;
