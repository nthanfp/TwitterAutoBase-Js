import 'dotenv/config';

import TwitterBot from './utils/twitter.js';

const bot = new TwitterBot({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_KEY_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  triggerWord: process.env.TRIGGER,
});

async function __main__() {
  let tempMessage = {};
  try {
    const authenticatedUserId = await bot.getAdminUserInfo();
    const message = await bot.getDirectMessage(authenticatedUserId);
    if (message.id) {
      tempMessage = message;
      const { data } = await bot.tweetMessage(message);
      const response = await bot.deleteMessage(message);
      console.log(`[~] DM has been successfuly reposted with id: ${data.id} @ ${data.created_at}`);
      console.log('------------------------------------');
    } else {
      console.log('[~] No tweet to post');
      console.log('------------------------------------');
    }
  } catch (error) {
    console.log(error, '[!] ERROR.');
    console.log('------------------------------------');
    if (tempMessage.id) {
      await bot.deleteMessage(tempMessage);
    }
  }
}

__main__();
