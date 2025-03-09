import { APIResponse, DrugRequestBody } from "@src/types";
import { getResponseStream } from "@src/utils/openai";
import express, { Request, Response } from 'express';
import { body, validationResult } from "express-validator";

const router = express.Router();

router.post(
  '/drug',
  [
    body('name').isString().notEmpty()
  ],
  async function (req: Request<{}, {}, DrugRequestBody>, res: Response<APIResponse<string>>) {
    const error = validationResult(req);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    if (!error.isEmpty()) {
      res.status(400).json({ success: false, error: error.array()[0].msg });
      return;
    }

    const name = req.body.name;
    const stream = await getResponseStream(`请帮我生成一个药品“${name}”的介绍，要求字数在200字以内，不要超过500字`);
    stream.on("data", (chunk) => {
      const chunkTexts = new TextDecoder().decode(chunk).split("\n");
      for (const chunkText of chunkTexts) {
        if (chunkText === '') continue;
        const text = chunkText.replace(/^data: /, "");
        if (text === "[DONE]") {
          res.end();
          return;
        }
        try {
          const data = JSON.parse(text);
          const content = data.choices[0].delta.content;
          if (content) {
            res.write(`${content}`);
          }
        } catch (e) {
          console.error(e);
          res.end();
        }
      }
    });

    stream.on("end", () => {
      res.end();
    });



  }
)

export default router;