const twilio = require('twilio');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const accountSid  = process.env.TWILIO_ACCOUNT_SID;
    const apiKeySid   = process.env.TWILIO_API_KEY_SID;
    const apiSecret   = process.env.TWILIO_API_SECRET;
    const twimlAppSid = process.env.TWILIO_APP_SID;

    const AccessToken  = twilio.jwt.AccessToken;
    const VoiceGrant   = AccessToken.VoiceGrant;

    const token = new AccessToken(accountSid, apiKeySid, apiSecret, {
      identity: 'pavement-crm-user',
      ttl: 3600
    });

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: false,
    });

    token.addGrant(voiceGrant);
    res.status(200).json({ token: token.toJwt() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
