import * as rocketChat from '@rocket.chat/sdk';
const rocketchatDriver = rocketChat.driver;
import * as config from '../config';

class rocketchat {
  constructor() {
    this.driver = rocketchatDriver;
    this.myuserid;
    this.processMessages = this.processMessages.bind(this);
    this.sentMsg = this.sentMsg.bind(this);
  }

  async init() {
    await this.driver.connect({
      host: config.host,
      useSsl: true
    })
    this.myuserid = await this.driver.login({
      username: config.user,
      password: config.password
    });
    await this.driver.subscribeToMessages();
    await this.driver.respondToMessages(this.processMessages, {
      rooms: ["jamme-test"],
      dm: true,
      edited: true,
      livechat: false
    });
  }

  async processMessages(err, message, messageOptions) {
    if (!err) {
      if (this.myuserid === message.u._id) return;
      const roomname = await this.driver.getRoomName(message.rid);
      if (message.msg.startsWith(config.botname)) {
        var response = message.u.username +
          ', Comment ' + config.botname + ' peut t\'aider à propos de ' +
          message.msg.substr(config.botname.length + 1);
        this.sentMsg(response, roomname);
      }
    }
  }

  async sentMsg(message, room) {
    return await this.driver.sendToRoom(message, room);
  }
}

export {
  rocketchat
}