export interface DiagnosisRequestBody {
  department: string;
  question: string;
}

export interface DiagnosisResponseBody {
  diagnosis: string;
  drugs: string[];
  advice: string;
}

export interface DiagnosisRecordQuery {
  limit?: number;
  cursor?: number;
}

export interface DiagnosisRecord {
  department: string;
  question: string;
  diagnosis: string;
  drugs: string[];
  advice: string;
  createdAt: Date;
}

export interface DrugRequestBody {
  name: string;
}

export interface OpenAIResponse {
  choices: {
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
  }[];
  created: number;
  id: string;
  model: string;
  object: string;
  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
  };
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
