export interface AskRequestBody {
  department: string;
  question: string;
}

export interface AskResponseBody {
  answer: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
