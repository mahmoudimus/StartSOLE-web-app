var soleConfig = module.exports = {};

var ring = process.env.RING || 'regular';        // can be "hrsa" or nothing
var environment = process.env.ENVIRONMENT || 'local';

soleConfig.logo = 'logo.png'; //default
soleConfig.tagline = 'Let learning happen'; //default
soleConfig.ring = 'startsole'; //default
soleConfig.serverUrl = 'http://localhost:1339/soleapp'; //defaultly set to local
soleConfig.appId = 'Hcwnq8U7xN4Z2bXcSBdvv4bjfRNKCpPSahXgeq9xRp'; //same for all environments
soleConfig.facebookAppID = '283486318802722' //default for local testing

//change some values if the ring is HRSA
if (ring.toLowerCase() == 'hrsa') {
  soleConfig.logo = 'logo-hrsa.png';
  soleConfig.ring = 'hrsa';
  // soleConfig.facebookAppID = ''; //
}

//change some values if this is being run locally/staging/production
if (environment.toLowerCase() == 'production') {
  soleConfig.serverUrl = 'https://api.startsole.net/sole/';
  soleConfig.facebookAppID = '495194740686129'; //production facebook app ID
} else if (environment.toLowerCase() == 'staging') {
  soleConfig.serverUrl = 'https://api.staging.startsole.net/sole/';
  // soleConfig.facebookAppID = ''; // same as local testing
}
