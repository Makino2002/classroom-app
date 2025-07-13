const admin = require('firebase-admin');

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const serviceAccount = require('./serviceAccountKey.json');
const authRoutes = require('./routes/authRoutes');
const instructorRoutes = require('./routes/instructorRoutes');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Backend đã chạy thành công!');
});
app.use('/api/auth', authRoutes);
app.use('/api/instructor', instructorRoutes);


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

admin.firestore().collection('test').add({ hello: 'world' })
  .then(() => console.log('Kết nối Firebase thành công!'))
  .catch(err => console.error('Kết nối Firebase thất bại:', err));
