import express from 'express';
import mongoose from 'mongoose';
import { env } from '@src/config';
import { errorHandler } from '@src/middlewares/errorHandler';
import diagnosisRouter from '@src/routes/diagnosis.routes';
import drugRouter from '@src/routes/drug.routes';

const app = express();
app.use(express.json());

// 数据库连接
mongoose.connect(env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

  // 中间件，输出请求日志
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// 路由注册
app.use('/api', diagnosisRouter);
app.use('/api', drugRouter)

// 错误处理
app.use(errorHandler);

const PORT = env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
