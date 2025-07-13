// backend/controllers/studentController.js
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASS }
});

// (POST) /api/student/loginEmail
exports.loginEmail = async (req, res) => {
  const db = admin.firestore();

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'email is required' });

  const accessCode = Math.floor(100000 + Math.random() * 900000).toString();
  await db.collection('emailCodes').doc(email).set({ code: accessCode, createdAt: new Date() });

  // Gửi email
  try {
    await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'đây là code test',
        text: `đây là code ${accessCode}`
    });

    res.json({ success: true, message: 'Access code sent to email' });
  } catch (err) {
    res.status(500).json({ error: 'Cannot send email', detail: err.message });
  }
};
// (POST) /api/student/validateAccessCode
exports.validateAccessCode = async (req, res) => {
  const db = admin.firestore();

  const { email, accessCode } = req.body;
  if (!email || !accessCode) return res.status(400).json({ error: 'email and accessCode required' });

  const doc = await db.collection('emailCodes').doc(email).get();
  if (!doc.exists || doc.data().code !== accessCode)
    return res.status(400).json({ success: false, error: 'Invalid code' });

  await db.collection('emailCodes').doc(email).delete();
  res.json({ success: true });
};
// (POST) /api/student/validateAccessCode
exports.validateAccessCode = async (req, res) => {
  const db = admin.firestore();

  const { email, accessCode } = req.body;
  if (!email || !accessCode) return res.status(400).json({ error: 'email and accessCode required' });

  const doc = await db.collection('emailCodes').doc(email).get();
  if (!doc.exists || doc.data().code !== accessCode)
    return res.status(400).json({ success: false, error: 'Invalid code' });

  await db.collection('emailCodes').doc(email).delete();
  res.json({ success: true });
};
// (GET) /api/student/myLessons?phone=xxx
exports.getMyLessons = async (req, res) => {
  const db = admin.firestore();

  const { phone } = req.query;
  if (!phone) return res.status(400).json({ error: 'phone required' });

  const lessonsSnap = await db.collection('students').doc(phone).collection('lessons').get();
  const lessons = [];
  lessonsSnap.forEach(doc => lessons.push(doc.data()));
  res.json(lessons);
};
exports.markLessonDone = async (req, res) => {
  const db = admin.firestore();
  const { phone, lessonId } = req.body;
  if (!phone || !lessonId) return res.status(400).json({ error: 'phone and lessonId required' });

  const lessonRef = db.collection('students').doc(phone).collection('lessons').doc(lessonId);
  const lessonDoc = await lessonRef.get();
  if (!lessonDoc.exists) {
    return res.status(404).json({ error: 'Lesson not found' });
  }

  await lessonRef.update({ done: true });
  res.json({ success: true });
};
exports.editProfile = async (req, res) => {
  const db = admin.firestore();
  const { phone, name, email } = req.body;
  if (!phone) return res.status(400).json({ error: 'phone required' });

  const studentRef = db.collection('students').doc(phone);
  const doc = await studentRef.get();

  if (!doc.exists) {
    return res.status(404).json({ error: 'Student not found' });
  }

  await studentRef.update({ name, email });
  res.json({ success: true });
};

