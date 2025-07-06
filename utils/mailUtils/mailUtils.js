const axios = require('axios');
const https = require('https');

const BASE_URL = 'https://api.mail.tm';
const PASSWORD = 'Passwor@d123';

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

async function createTemporaryEmail() {
  try{
  const domainRes = await axios.get(`${BASE_URL}/domains`, { httpsAgent });
  const domain = domainRes.data['hydra:member'][0].domain;

  const email = `AutomationEmail${Date.now()}@${domain}`;

  await axios.post(`${BASE_URL}/accounts`, {
    address: email,
    password: PASSWORD
  }, {
    headers: { 'Content-Type': 'application/json' },
    httpsAgent 
  });

  return email; 
} catch(err){
  console.log(err);
}
}

export async function extractUrlFromEmail(email, subjectKeyword) {
  // 1. Authenticate
  const authRes = await axios.post(`${BASE_URL}/token`, {
    address: email,
    password: PASSWORD
  });
  const token = authRes.data.token;

  const headers = {
    Authorization: `Bearer ${token}`
  };

  // 2. Poll for messages
  for (let retries = 10; retries > 0; retries--) {
    const messagesRes = await axios.get(`${BASE_URL}/messages`, { headers });
    const messages = messagesRes.data['hydra:member'];

    for (const message of messages) {
      if (message.subject.includes(subjectKeyword)) {
        const messageId = message.id;
        const fullMessage = await axios.get(`${BASE_URL}/messages/${messageId}`, { headers });
        const htmlArr = fullMessage.data.html;

        if (htmlArr && htmlArr.length > 0) {
          const html = htmlArr[0];
          const match = html.match(/https?:\/\/[^\s"'>]+/);
          if (match) return match[0];
        }
      }
    }

    await new Promise(resolve => setTimeout(resolve, 5000)); // wait 5 seconds
  }

  return null;
}

module.exports = { createTemporaryEmail , extractUrlFromEmail};
