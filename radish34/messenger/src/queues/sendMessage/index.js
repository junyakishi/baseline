const Queue = require('bull');
const logger = require('winston');
const { setQueues } = require('bull-board');
const Config = require('../../../config');
const { messagingType } = Config;

const requestNamespace = `baseline:messenger:sendMessage:req`;
const responseNamespace = `baseline:messenger:sendMessage:res`;

let sendMessageReqQueue;
let sendMessageResQueue;

try {
  sendMessageReqQueue = new Queue(requestNamespace, Config[messagingType].users[0].redisUrl);
  logger.debug(`SUCCESS: connected to bull queue "${requestNamespace}" at ${Config[messagingType].users[0].redisUrl}`);
  sendMessageResQueue = new Queue(responseNamespace, Config[messagingType].users[0].redisUrl);
  logger.debug(`SUCCESS: connected to bull queue "${responseNamespace}" at ${Config[messagingType].users[0].redisUrl}`);
} catch (error) {
  logger.error(`ERROR: could not connect to bull queue "baseline:messenger:sendMessage" at ${Config[messagingType].users[0].redisUrl}`);
}

// Adding Queue to BullBoard Admin UI
setQueues([sendMessageReqQueue, sendMessageResQueue]);

sendMessageReqQueue.process(`${__dirname}/processSendMessage.js`);

module.exports = {
  sendMessageReqQueue,
  sendMessageResQueue,
};
