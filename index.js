console.log('======= slackutil.js =======');

var request = require('request');

var Slackroom = function(token) {

  this.token       = token;

  this.userObj     = Object.create(null);
  this.chanObj     = Object.create(null);
  this.chaninfoObj = Object.create(null);
  this.histObj     = Object.create(null);

  this.username    = Object.create(null);
  this.useremail   = Object.create(null);
  this.userimg48   = Object.create(null);
  this.userimg32   = Object.create(null);

  this.keywords    = Object.create(null);

  this.sortedChannelList = [];

  this.set_userObj = function(obj) {
    this.userObj = obj;

    //update hash tables
    for (var idx in obj.members) {

      var rec = obj.members[idx];

      var key = rec.id;
      var name = rec.real_name;
      var email = rec.profile.email;
      var img32 = rec.profile.image_32;
      var img48 = rec.profile.image_48;

      if(typeof key == 'undefined') key = '';
      if (key.length < 1) key = '';

      if(typeof name == 'undefined') name = '';
      if (name.length < 1) name = '';

      if(typeof email == 'undefined') email = '';
      if (email.length < 1) email = '';

      this.username[key] = name;
      this.useremail[key] = email;
      this.userimg32[key] = img32;
      this.userimg48[key] = img48;
    }

  }

  this.set_chanObj = function(obj) {
    this.chanObj = obj;
  }

  this.set_chaninfoObj = function(obj) {
    this.chaninfoObj = obj;
  }

  this.getUsers = function(callback) {

    var xurl = { url: 'http://slack.com/api/users.list',
                 qs:  { token: this.token }
                 }

    request(xurl, function(error, response, data) {

      if (!error && response.statusCode == 200) {
        obj = JSON.parse(data);
        return callback(obj);
      } else {
        console.log('error = ' + error);
        console.log('response.statusCode = ' + response.statusCode);
      }

    });

  }

  this.getChannels = function(callback) {

    var xurl = { url: 'http://slack.com/api/channels.list',
               qs:  { token: this.token }
               }

    request(xurl, function(error, response, data) {

      if (!error && response.statusCode == 200) {
        return callback(JSON.parse(data));
      } else {
        console.log('error = ' + error);
        console.log('response.statusCode = ' + response.statusCode);
      }

    });

  }

  this.getChaninfo = function(channelId, callback) {

    var xurl = { url: 'http://slack.com/api/channels.info',
               qs:  { token: this.token,
                      channel: channelId
                    }
               }

    request(xurl, function(error, response, data) {

      if (!error && response.statusCode == 200) {
        return callback(JSON.parse(data));
      } else {
        console.log('error = ' + error);
        console.log('response.statusCode = ' + response.statusCode);
      }

    });

  }

  this.getHistory = function(channelId, startTime, callback) {

    var channelHistoryUrl = 'http://slack.com/api/channels.history';

    var xurl = { url: channelHistoryUrl,
               qs:  { token: this.token,
                      channel: channelId,
                      oldest: startTime ? startTime : 0,
                      count: 1000,
                      rejectUnauthorized: false
                    }
               }

    request(xurl, function(error, response, data) {

      if (!error && response.statusCode == 200) {
        return callback(JSON.parse(data));
      } else {
        console.log('error = ' + error);
        console.log('response.statusCode = ' + response.statusCode);
      }

    });

  }

  this.set_histObj = function(channel, obj) {
    this.histObj[channel] = obj;
  //}

  //this.set_keywords = function(channel, obj) {

    var keywords  = Object.create(null);

    for (var idx in obj.messages) {

      var thisRec = obj.messages[idx];

      var words = thisRec.text.split(' ');

      for (var indx in words) {

        var wordx = words[indx].toLowerCase();

        if (typeof wordx == 'undefined') continue;

        if (wordx < 'a') continue;
        if (wordx > 'zzzz') continue;

        wordx = this.checkLastChar(wordx);

        if (wordx.length > 15) continue;
        if (wordx.length < 4) continue;

        var kount = keywords[wordx];
        if (typeof kount == 'undefined') {
          kount = 1;
        } else {
          ++kount;
        }

        keywords[wordx] = kount;
      }

    }

    var keys = [];
    for (key in keywords) {
      var kount = keywords[key];
      if (kount < 1) continue;

      var recc =  key + '|' + kount;

      keys.push(recc);
    }

    keys.sort();

    this.keywords[channel] = keys;
  }

  this.checkLastChar = function(str) {
    while (true) {
      var ch = str.substring(str.length - 1);
      if (ch < 'a' || ch > 'z') str = str.substring(0, str.length - 1);
      else break;
    }

    if (str.indexOf('\n') >= 0) str = '';

    return str;
  }

  console.log('Slackroom instantiated');
};

exports.Slackroom = Slackroom;
