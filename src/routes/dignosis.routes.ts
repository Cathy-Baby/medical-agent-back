import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AskRequestBody, APIResponse, AskResponseBody } from '@src/types';
import Question from '@src/models/Question';
import { getResponse } from '@src/utils/openai';

const router = express.Router();

// 创建咨询记录的中间件
const createQuestionRecord = async (
  req: Request<{}, {}, AskRequestBody>,
  res: AskResponseBody,
) => {
  const newQuestion = new Question({
    department: req.body.department,
    question: req.body.question,
    ...res
  });
  await newQuestion.save();
};

router.post(
  '/dignosis',
  [
    body('department').isString().notEmpty(),
    body('question').isString().notEmpty()
  ],
  async function(req: Request<{}, {}, AskRequestBody>, res: Response<APIResponse<AskResponseBody>>) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: errors.array()[0].msg });
      return;
    }
    
    const { department, question } = req.body;
    const fullQuestion = `你是一位资深的${department}专家，有一位患者在咨询你，请严格按照以下 JSON 格式回答问题：
    {"diagnosis": "诊断结果", "drugs": ["药品1", "药品2", "药品3", "药品4"], "advice": "治疗建议"}
    问题：${question}`
    console.log(fullQuestion)
    const response = await getResponse(fullQuestion, true);
    if (response.success) {
      const answer_str = response.data!.choices[0].message.content;
      const answer = JSON.parse(answer_str) as AskResponseBody;
      await createQuestionRecord(req, answer);
      console.log(answer)
      res.json({ success: true, data: answer });
    } else {
      res.status(500).json({ success: false, error: response.error });
    }
  }
);

export default router;
