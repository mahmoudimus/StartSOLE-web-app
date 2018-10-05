var Dashboard = module.exports = {};
var Parse       =  require('parse/node');
var soleConfig = require('../sole-config.js');

// connect to parse server
Parse.initialize(soleConfig.appId);
Parse.serverURL = soleConfig.serverUrl;

//returns data for building dashboard
Dashboard.getDashboardData = function (sessionToken) {
  return Parse.Cloud.run('webapp.getDashboardData', {
    sessionToken: sessionToken
  });
}