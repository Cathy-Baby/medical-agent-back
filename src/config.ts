import dotenv from 'dotenv';
dotenv.config();

export const env = {
  MONGODB_URI: process.env.MONGODB_URI!,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000
};
