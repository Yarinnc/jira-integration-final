import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/jira';

export interface JiraUser {
  accountId: string;
  avatarUrls: {
    '48x48': string;
    '24x24': string;
    '16x16': string;
    '32x32': string;
  };
  displayName: string;
}

export const authenticateUser = async (
  email: string,
  apiKey: string
): Promise<void> => {
  await axios.post(
    `${API_BASE_URL}/authenticate`,
    { email, apiKey },
    { withCredentials: true }
  );
};

export const fetchUsers = async (): Promise<JiraUser[]> => {
  const response = await axios.get<JiraUser[]>(`${API_BASE_URL}/users`, {
    withCredentials: true,
  });
  return response.data;
};

export const createIssue = async (formData: {
  projectId: string;
  title: string;
  description: string;
  occurrences: number;
  owner: string;
}): Promise<{ issueLink: string }> => {
  const response = await axios.post(`${API_BASE_URL}/issues`, formData, {
    withCredentials: true,
  });
  return response.data;
};
