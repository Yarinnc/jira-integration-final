const axios = require('axios');
require('dotenv').config();
class JiraService {
  constructor(email, token) {
    this.email = email;
    this.token = token;
  }

  async fetchJira(path, method, body) {
    try {
      const response = await axios.request({
        url: `https://${process.env.PROJECT_NAME}.atlassian.net/rest/api/3/${path}`,
        method,
        data: body,
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${this.email}:${this.token}`
          ).toString('base64')}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        const errorMessage = data.errorMessages?.length
          ? data.errorMessages
          : data.errors
          ? Object.values(data.errors)
          : 'An unknown error occurred.';
        throw {
          status: status,
          message: errorMessage,
        };
      } else {
        throw { status: 500, message: error.message };
      }
    }
  }

  getUsers() {
    return this.fetchJira('users/search', 'GET');
  }

  getIssue(issueIdOrKey) {
    return this.fetchJira(`issue/${issueIdOrKey}`);
  }

  createIssue(projectId, title, description, occurrences, owner) {
    const body = {
      fields: {
        project: {
          id: projectId,
        },
        summary: title,
        issuetype: {
          id: '10002',
        },
        description: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: description,
                },
              ],
            },
          ],
        },

        customfield_10037: occurrences,
        assignee: {
          id: owner,
        },
      },
      update: {},
    };

    return this.fetchJira('issue', 'POST', body);
  }
}

module.exports = JiraService;
