const express = require('express');
const JiraService = require('./jiraService');
const router = express.Router();
require('dotenv').config();

router.post('/authenticate', async (req, res) => {
  const { email, apiKey } = req.body;

  req.session.email = email;
  req.session.apiKey = apiKey;

  try {
    new JiraService(email, apiKey);
    res.send('success');
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    if (!req.session.email || !req.session.apiKey) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const jiraService = new JiraService(req.session.email, req.session.apiKey);
    const users = await jiraService.getUsers();

    const filteredUsers = users.filter(
      (user) => user.accountType === 'atlassian'
    );

    res.json(filteredUsers);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message });
  }
});

router.post('/issues', async (req, res) => {
  try {
    const { projectId, title, description, occurrences, owner } = req.body;
    if (!projectId || !title || !description || !occurrences || !owner) {
      res
        .status(400)
        .json({ message: 'One or more inputs are missing values.' });
    }

    const data = await req.jiraService.createIssue(
      projectId,
      title,
      description,
      occurrences,
      owner
    );
    const issueLink = `https://${process.env.PROJECT_NAME}.atlassian.net/browse/${data.key}`;

    res.json({ issueLink });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message });
  }
});

module.exports = router;
