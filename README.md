# slackutil

## Example
The code fragments below show how to create multiple room objects ( each Slack room requires a different api token )
and then access the user, channel and history information for that room
Note: These methods ( ... getUsers(), getChannels(), getChaninfo(), getHistory() ... ) are all automatically cached.
ie Info is initially pulled from from Slack, but any subsequent calls to these methods within a 60-second timeframe will return the existing data.
```javascript
var ut = require('../slackutil’);
var toList = require('jsontolist');

var room1 = new ut.Slackroom( slack-api-token-goes-here);
var room2 = new ut.Slackroom( a-different-slack-api-token-goes-here);

var channelId = 'C03JFH273';

//--------Routes--------

app.get('/getUsers', function(req, res) {

  room1.getUsers(function(obj) {
    room1.set_userObj(obj);
    var out = toList(obj);
    res.send(out);
  });

});

//---

app.get('/getChannels', function(req, res) {

  room1.getChannels(function(obj) {
    room1.set_chanObj(obj);
    var out += toList(obj);
    res.send(out);
  });

});

//---

app.get('/getChaninfo', function(req, res) {

  room1.getChaninfo(channelId, function(obj) {
    room1.set_chaninfoObj(channelId, obj);
    var out += toList(obj);
    res.send(out);
  });

});

//---

app.get('/getHistory', function(req, res) {

  room1.getHistory(channelId, 0, function(obj) {
    room1.set_histObj(channelId, obj);
    var out += toList(obj);
    res.send(out);
  });

});
```
