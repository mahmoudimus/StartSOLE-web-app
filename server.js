const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');
const hbs         = require('express-hbs');
const path        = require('path');
const moment      = require('moment');
const i18n        = require('i18n');
const Controllers = require('./controllers/controllers.js');
const cookieParser = require('cookie-parser');
const logger = require('./logger.js');
const hbsHelper = require('./helpers/handlebars-helpers.js')(hbs);
const middlewares = require("./middleware/middlewares.js");
const soleConfig  = require('./sole-config.js');
const port = process.env.PORT || 8080; // set our port

logger.useSlackBot = process.env.ENVIRONMENT === 'production'; //true if production, false otherwise

i18n.configure({
  locales: ['en', 'es'],
  directory: __dirname + '/locales',
  defaultLocale: 'en',
  cookie: 'language'
});

// ******************
// set up the webserver
// ******************
// set the view engine
app.set('view engine', 'hbs');

// configure the view engine
app.engine('hbs', hbs.express4({
  defaultLayout: __dirname + '/views/layouts/default.hbs',
  partialsDir: __dirname + '/views/partials',
  layoutsDir: __dirname + '/views/layouts'
}));

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(i18n.init);

app.use(middlewares.setLanguage);
app.use(middlewares.logErrors);
app.use(middlewares.errorHandler);

const preloginRouter = require('./routes/router-prelogin.js'); //unauth'ed routers like login, logout, register
const router = require('./routes/router.js'); //default routes, all auth-required
const adminRouter = require('./routes/router-admin.js'); //admin routes, auth-required plus admin role
const slackbotRouter = require('./routes/router-slackbot.js'); //slackbot routes, unauth'ed
const miscRouter = require('./routes/router-misc.js'); //misc routes, unauth'ed

// REGISTER OUR ROUTES -------------------------------
app.use('/', preloginRouter); //unauthenticated routes
app.use('/', router); //authenticated routes
app.use('/', miscRouter); //authenticated routes
app.use('/admin', adminRouter);
app.use('/slackbot', slackbotRouter);


// serve static content
app.use(express.static(path.join(__dirname, 'public')));

/**
 * catch-all route for 404 errors
 */
app.get('*', function(req, res, next){
  const err = {
    userMessage: '404. This page does not exist.',
    req: req
  };
  middlewares.errorHandler(err, req, res, next)
});

// START THE SERVER
// =============================================================================

logger.log('\n\n/^(o.o)^\ /^(o.o)^\ /^(o.o)^\ /^(o.o)^\ /^(o.o)^\ /^(o.o)^\ \n');
logger.log('           Ring: ' + soleConfig.ring);
logger.log('    Environment: ' + soleConfig.environment);
logger.log('   Database URL: ' + soleConfig.serverUrl);
logger.log('Facebook App ID: ' + soleConfig.facebookAppID);
logger.log('      Google UA: ' + soleConfig.googleAnalyticsUA);
logger.log(' Google AdWords: ' + soleConfig.googleAdWordsID);
logger.log(' Slack API Token: ' + soleConfig.slackToken);
logger.log(' Slack Channel: ' + soleConfig.slackChannel);
logger.log('\n/^(o.o)^\ /^(o.o)^\ /^(o.o)^\ /^(o.o)^\ /^(o.o)^\ /^(o.o)^\ \n\n');

app.listen(port);

logger.log('.d8888. d888888b  .d8b.  d8888b. d888888b .d8888.  .d88b.  db      d88888b ');
logger.log('88\'  YP `~~88~~\' d8\' `8b 88  `8D `~~88~~\' 88\'  YP .8P  Y8. 88      88\'     ');
logger.log('`8bo.      88    88ooo88 88oobY\'    88    `8bo.   88    88 88      88ooooo ');
logger.log('  `Y8b.    88    88~~~88 88`8b      88      `Y8b. 88    88 88      88~~~~~ ');
logger.log('db   8D    88    88   88 88 `88.    88    db   8D `8b  d8\' 88booo. 88.     ');
logger.log('`8888Y\'    YP    YP   YP 88   YD    YP    `8888Y\'  `Y88P\'  Y88888P Y88888P \n');

logger.log('Server running. You can view it locally at http://localhost:' + port);

if (logger.useSlackBot) {
  logger.slackbot({title: 'Just started the server!'});
}