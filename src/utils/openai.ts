import { env } from "@src/config";
import fetch from "node-fetch";
import { APIResponse, OpenAIResponse } from "@src/types";

const url = env.OPENAI_API_URL + "/chat/completions";
const headers = {
  'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
  'Content-Type': 'application/json'
};

export async function getResponse(prompt: string, jsonFormat: boolean = false): Promise<APIResponse<OpenAIResponse>> {
  const data = {
    model: "deepseek/deepseek-v3-turbo",
    messages: [
      { role: "system", content: "你是一位资深的医学专家，精通各种医术，对世界上所有的药品了如指掌，无数人在你的诊疗下起死回生。" },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    response_format: {
      type: jsonFormat ? "json_object" : "text"
    }
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    })
    const response = (await res.json()) as OpenAIResponse;
    return {
      success: true,
      data: response
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: `${error}`
    }
  }

}


