import { createHmac } from 'crypto';
import { writeFileSync } from 'fs';
import OAuth from 'oauth-1.0a';
import axios from 'axios';

const OAuthHelper = (mediaUrl) => {
  const oauth = OAuth({
    consumer: {
      key: process.env.CONSUMER_KEY,
      secret: process.env.CONSUMER_KEY_SECRET,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
      return createHmac('sha1', key).update(base_string).digest('base64');
    },
  });

  const authorization = oauth.authorize(
    {
      url: mediaUrl,
      method: 'GET',
    },
    {
      key: process.env.ACCESS_TOKEN,
      secret: process.env.ACCESS_TOKEN_SECRET,
    }
  );

  return oauth.toHeader(authorization);
};

const downloadMedia = async (mediaUrl, fileName) => {
  try {
    console.log('Download media .......');
    console.log(mediaUrl);
    const authorization = OAuthHelper(mediaUrl);
    const { data } = await axios({
      method: 'GET',
      url: mediaUrl,
      headers: authorization,
      responseType: 'arraybuffer',
      maxRedirects: 0,
    });
    writeFileSync(fileName, data);
    console.log('Media has been successfuly downloaded ......');
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default downloadMedia;
