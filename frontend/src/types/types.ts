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

export type FormData = {
  projectId: string;
  title: string;
  description: string;
  occurrences: string;
  owner: string;
};

export type InputField = {
  name: keyof FormData;
  label: string;
  type: string;
};
