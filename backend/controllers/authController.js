const admin = require('firebase-admin');
const twilio = require('twilio');
const TWILIO_SID = process.env.TWILIO_SID;
const TWILIO_AUTH = process.env.TWILIO_AUTH;
const TWILIO_PHONE = process.env.TWILIO_PHONE;
const twilioClient = twilio(TWILIO_SID, TWILIO_AUTH);

exports.createAccessCode = async (req, res) => {
  const db = admin.firestore();
  const { phoneNumber } = req.body;
  if (!phoneNumber) return res.status(400).json({ error: 'phoneNumber required' });
  const accessCode = Math.floor(100000 + Math.random() * 900000).toString();
  await db.collection('accessCodes').doc(phoneNumber).set({ code: accessCode, createdAt: new Date() });
  // await twilioClient.messages.create({
  //   body: `Your access code is: ${accessCode}`,
  //   from: TWILIO_PHONE,
  //   to: phoneNumber
  // });
  res.json({ success: true, message: `Your access code is: ${accessCode}` });

};

exports.validateAccessCode = async (req, res) => {
  const db = admin.firestore();
  const { phoneNumber, accessCode } = req.body;
  if (!phoneNumber || !accessCode) return res.status(400).json({ error: 'phoneNumber and accessCode required' });
  const doc = await db.collection('accessCodes').doc(phoneNumber).get();
  if (!doc.exists || doc.data().code !== accessCode) return res.status(400).json({ success: false, error: 'Invalid code' });
  await db.collection('accessCodes').doc(phoneNumber).delete();
  res.json({ success: true, userType: 'student' });
};
