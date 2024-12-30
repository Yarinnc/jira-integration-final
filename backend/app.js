const createError = require('http-errors');
const express = require('express');
const jiraRouter = require('./jiraRoutes');
const JiraService = require('./jiraService');
const session = require('express-session');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: 'jitassignment',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use((req, res, next) => {
  const { email, apiKey } = req.session;

  if (req.path === '/jira/authenticate') {
    next();
  } else {
    if (!email || !apiKey) {
      res.status(401).send('Missing authentication data');
    } else {
      req.jiraService = new JiraService(email, apiKey);

      next();
    }
  }
});

app.use('/jira', jiraRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
