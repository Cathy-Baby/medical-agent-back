import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { AskRequestBody, APIResponse, AskResponseBody } from '../types';
import Question from '../models/Question';

const router = express.Router();

// 创建咨询记录的中间件
const createQuestionRecord = async (
  req: Request<{}, {}, AskRequestBody>,
  answer: string
) => {
  const newQuestion = new Question({
    department: req.body.department,
    question: req.body.question,
    answer
  });
  await newQuestion.save();
};

router.post(
  '/ask',
  [
    body('department').isString().notEmpty(),
    body('question').isString().notEmpty()
  ],
  async (req: Request<{}, {}, AskRequestBody>, res: Response<APIResponse<AskResponseBody>>) => {
    console.log(req.body);
    res.status(200).json({
      success: true,
      data: {
        answer: '这是一个测试答案'
      },
    })
  }
);

export default router;
