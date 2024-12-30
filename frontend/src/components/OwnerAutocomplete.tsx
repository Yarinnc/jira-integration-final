import React, { useCallback, useEffect, useState } from 'react';
import { TextField, Autocomplete, Box } from '@mui/material';
import { fetchUsers } from '../api/jiraApi';
import { JiraUser } from '../types/types';

interface OwnerAutocompleteProps {
  onError: React.Dispatch<React.SetStateAction<string>>;
  value: string;
  onChange: (value: JiraUser | null) => void;
}

const OwnerAutocomplete: React.FC<OwnerAutocompleteProps> = ({
  value,
  onError,
  onChange,
}) => {
  const [users, setUsers] = useState<JiraUser[]>([]);

  const getUsers = useCallback(async () => {
    try {
      const users = await fetchUsers();
      setUsers(users);
    } catch (err) {
      console.error(err);
      onError('Failed to fetch Jira users');
    }
  }, [onError]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <Autocomplete
      options={users}
      getOptionLabel={(option) => option.displayName}
      value={users.find((user) => user.accountId === value) || null}
      onChange={(_, value) => onChange(value)}
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
        >
          <img
            src={option.avatarUrls['32x32']}
            alt={option.displayName}
            style={{ width: 32, height: 32, borderRadius: '50%' }}
          />
          {option.displayName}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Owner"
          placeholder="Select an owner"
          margin="normal"
        />
      )}
      fullWidth
      sx={{ mt: 1 }}
    />
  );
};

export default OwnerAutocomplete;
