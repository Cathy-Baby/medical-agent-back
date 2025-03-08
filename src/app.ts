import express from 'express';
import mongoose from 'mongoose';
import { env } from './config';
import { errorHandler } from './middlewares/errorHandler';
import askRouter from './routes/ask.routes';

const app = express();
app.use(express.json());

// 数据库连接
mongoose.connect(env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// 路由注册
app.use('/api', askRouter);

// 错误处理
app.use(errorHandler);

const PORT = env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
