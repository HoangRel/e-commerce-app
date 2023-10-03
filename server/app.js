const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
const multer = require('multer');

const { fileStorage, fileFilter } = require('./utils/multer-options');

const User = require('./models/user');
const checkAuth = require('./utils/check-auth');
const ChatRoom = require('./models/chat-room');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/product');
const chatRoomRoutes = require('./routes/chat-room');

const MONGDB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@asm-3.qjn87mn.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;

const app = express();

const store = new MongoDBStore({
  uri: MONGDB_URI,
  collection: 'sessions',
});

app.use(
  cors({
    // origin: (origin, cb) => cb(null, true),
    origin: [process.env.ADMIN_HOSTNAME, process.env.CLIENT_HOSTNAME],
    credentials: true,
  })
);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(bodyParser.json());

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).array('images', 4)
);

app.set('trust proxy', 1);

app.use(
  session({
    secret: process.env.SECRET_KEY,
    saveUninitialized: false,
    resave: false,
    store,
    cookie: {
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 10000,
      secure: true,
    },
    proxy: true,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/shop', productRoutes);
app.use('/chat', chatRoomRoutes);
app.get('/check-auth', checkAuth);

app.use((error, req, res, next) => {
  console.log('err 500');
  res.status(500).json({ message: 'ERROR!' });
});

mongoose
  .connect(MONGDB_URI)
  .then(result => {
    const server = app.listen(process.env.PORT || 8080);
    const io = require('./socket').unit(server);

    const connectedClients = {};
    io.on('connection', socket => {
      // Khi client kết nối, lưu thông tin roomId trong danh sách
      socket.on('join_room', roomId => {
        socket.join(roomId);
        connectedClients[socket.id] = roomId;
      });

      // Xử lý sự kiện khi client gửi tin nhắn
      socket.on('send_message', ({ roomId, message }) => {
        io.to(roomId).emit('receive_message', { roomId, message });
      });

      // Xử lý sự kiện khi client đăng xuất hoặc ngắt kết nối
      socket.on('request_disconnect', () => {
        const roomId = connectedClients[socket.id];
        if (roomId) {
          io.emit('chat_ended', { roomId });

          ChatRoom.findByIdAndUpdate(roomId)
            .then(room => {
              room.ended = true;
              room.save();
            })
            .catch(err => {
              next(new Error(err));
            });

          socket.leave(roomId);

          delete connectedClients[socket.id];
        }
      });
    });
  })

  .catch(err => {
    console.log(err);
  });
