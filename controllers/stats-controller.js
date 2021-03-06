const Parse = require('parse/node');

class Stats {
  static usersToday () {
    return Parse.Cloud.run('webapp.usersDateRange', {'length':0}).then(number=>{
      return 'We have had *'+number+'* users sign up today!';
    });
  };

  static usersRange (numberOfDays) {
    return Parse.Cloud.run('webapp.usersDateRange', {'length':numberOfDays}).then(number=>{
      return 'We have had *'+number+'* users sign up over the last '+numberOfDays+' days!';
    });
  };

  static usersRangeDetail (numberOfDays) {
    return Parse.Cloud.run('webapp.usersDateRangeDetails', {'length':numberOfDays}).then(userDetails=>{

      let messageEnding = '';

      //include a school name for any school with over 10 users for this date range
      for (let key in userDetails.schools) {
        if (userDetails.schools.hasOwnProperty(key)) {
          console.log(key + ' -> ' + userDetails.schools[key]);
          if(userDetails.schools[key] > 10){
            if(messageEnding.length<1){
              messageEnding += ' Most of them came from ';
              messageEnding += key+ ' ('+userDetails.schools[key]+' users)';
            }
            else {
              messageEnding += ', '+key+ ' ('+userDetails.schools[key]+' users)';
            }

          }
        }
      }
      return 'We have had *'+userDetails.userCount+'* users sign up over the last '+numberOfDays+' days!'+messageEnding;
    });
  };
}

module.exports = Stats;