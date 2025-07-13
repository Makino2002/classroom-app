const admin = require('firebase-admin');

// Thêm student mới
exports.addStudent = async (req, res) => {
  const db = admin.firestore();

  const { name, phone, email } = req.body;
  if (!name || !phone || !email) return res.status(400).json({ error: 'Missing data' });
  await db.collection('students').doc(phone).set({ name, phone, email, lessons: [] });
  res.json({ success: true });
};

// Giao bài học cho student
exports.assignLesson = async (req, res) => {
  const db = admin.firestore();

  const { studentPhone, title, description } = req.body;
  if (!studentPhone || !title || !description) return res.status(400).json({ error: 'Missing data' });

  const lessonId = db.collection('students').doc(studentPhone).collection('lessons').doc().id;
  const lesson = { lessonId, title, description, done: false };

  // Lưu lesson vào subcollection "lessons" của student
  await db.collection('students').doc(studentPhone)
    .collection('lessons').doc(lessonId).set(lesson);

  res.json({ success: true });
};

// Lấy danh sách tất cả student
exports.getStudents = async (req, res) => {
  const db = admin.firestore();

  const snapshot = await db.collection('students').get();
  const students = [];
  snapshot.forEach(doc => students.push(doc.data()));
  res.json(students);
};

// Lấy thông tin 1 student và các bài học
exports.getStudentByPhone = async (req, res) => {
  const db = admin.firestore();

  const { phone } = req.params;
  const studentDoc = await db.collection('students').doc(phone).get();
  if (!studentDoc.exists) return res.status(404).json({ error: 'Student not found' });

  const lessonsSnapshot = await db.collection('students').doc(phone).collection('lessons').get();
  const lessons = [];
  lessonsSnapshot.forEach(doc => lessons.push(doc.data()));

  res.json({ ...studentDoc.data(), lessons });
};

// Sửa thông tin student
exports.editStudent = async (req, res) => {
  const db = admin.firestore();

  const { phone } = req.params;
  const { name, email } = req.body;
  await db.collection('students').doc(phone).update({ name, email });
  res.json({ success: true });
};

// Xoá student
exports.deleteStudent = async (req, res) => {
  const db = admin.firestore();

  const { phone } = req.params;
  await db.collection('students').doc(phone).delete();
  res.json({ success: true });
};
