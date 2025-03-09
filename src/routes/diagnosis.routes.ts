import express, { Request, Response } from 'express';
import { body, check, param, validationResult } from 'express-validator';
import { DiagnosisRequestBody, APIResponse, DiagnosisResponseBody, DiagnosisRecord, DiagnosisRecordQueryBody } from '@src/types';
import Question from '@src/models/Question';
import { getResponse } from '@src/utils/openai';

const router = express.Router();

const createQuestionRecord = async (
  req: Request<{}, {}, DiagnosisRequestBody>,
  res: DiagnosisResponseBody,
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
  async function (req: Request<{}, {}, DiagnosisRequestBody>, res: Response<APIResponse<DiagnosisResponseBody>>) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, error: errors.array()[0].msg });
      return;
    }

    const { department, question } = req.body;
    const fullQuestion = `你是一位资深的${department}专家，有一位患者在咨询你，请严格按照以下 JSON 格式回答问题：
    {"diagnosis": "诊断结果", "drugs": ["药品1", "药品2", "药品3", "药品4"], "advice": "治疗建议"}
    问题：${question}`

    const response = await getResponse(fullQuestion, true);
    if (response.success) {
      const answer_str = response.data!.choices[0].message.content;
      const answer = JSON.parse(answer_str) as DiagnosisResponseBody;
      await createQuestionRecord(req, answer);

      res.json({ success: true, data: answer });
    } else {
      res.status(500).json({ success: false, error: response.error });
    }
  }
);

router.get(
  '/query-diagnosis/:limit?/:cursor?',
  [
    param('limit').isInt().optional(),
    param('cursor').isInt().optional()
  ],
  async function (req: Request<DiagnosisRecordQueryBody>, res: Response<APIResponse<DiagnosisRecord[]>>) {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.status(400).json({ success: false, error: error.array()[0].msg });
      return;
    }
    const { limit = 20, cursor = 0 } = req.params;
    try {
      const questions = await Question.find().sort({ createdAt: -1 }).skip(cursor).limit(limit);
      res.json({ success: true, data: questions });
    } catch (error) {
      res.status(500).json({ success: false, error: `${error}` });
    }

  }
)

export default router;
