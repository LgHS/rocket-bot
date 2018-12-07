const {
  driver
} = require('@rocket.chat/sdk');
const config = require('./config');
const delay = require('delay');
var myuserid;

(async () => {
  await driver.connect({
    host: config.host,
    useSsl: true
  })
  myuserid = await driver.login({
    username: config.user,
    password: config.password
  });
  await driver.subscribeToMessages();
  await driver.respondToMessages(processMessages, {
    rooms: ["jamme-test"],
    dm: true,
    edited: true,
    livechat: false
  });

})();

// callback for incoming messages filter and processing
const processMessages = async (err, message, messageOptions) => {
  if (!err) {
    if (message.u._id === myuserid) return;
    const roomname = await driver.getRoomName(message.rid);
    if (message.msg.startsWith(config.botname)) {
      var response;
      response = message.u.username +
        ', Comment ' + config.botname + ' peut t\'aider à propos de ' +
        message.msg.substr(config.botname.length + 1);
      const sentmsg = await driver.sendToRoom(response, roomname);
    }
  }
}