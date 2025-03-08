import { Schema, model, Document } from 'mongoose';

export interface Question extends Document {
  department: string;
  question: string;
  answer: string;
  createdAt: Date;
}

const QuestionSchema = new Schema<Question>({
  department: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default model<Question>('Question', QuestionSchema);
