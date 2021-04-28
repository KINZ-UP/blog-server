process.env.NODE_ENV =
  process.env.NODE_ENV &&
  process.env.NODE_ENV.trim().toLowerCase() == 'production'
    ? 'production'
    : 'development';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

const options = {
  origin:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'http://zeronine-web-portfolio.s3-website.ap-northeast-2.amazonaws.com', // 접근 권한을 부여하는 도메인
  credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
  optionsSuccessStatus: 200, // 응답 상태 200으로 설정
};

app.use(cors(options));

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(express.json());

const postsRouter = require('./routes/posts');
const uploadRouter = require('./routes/upload');
app.use('/posts', postsRouter);
app.use('/upload', uploadRouter);
app.listen(8000, () => {
  console.log(process.env.NODE_ENV);
});
