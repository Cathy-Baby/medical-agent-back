export interface AskRequestBody {
  department: string;
  question: string;
}

export interface AskResponseBody {
  diagnosis: string;
  drugs: string[];
  advice: string;
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
