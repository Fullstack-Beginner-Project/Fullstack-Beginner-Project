import express from 'express';
import cors from 'cors';
import router from './routes/index.js';



const app = express();

app.set('json replacer', (key, value) =>
  typeof value === 'bigint' ? value.toString() : value
);

// CORS 설정 - 환경 변수 설정 없을시, 모든 도메인 허용
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
  })
);
app.use(express.json());

app.use('/api', router);

export default app;
