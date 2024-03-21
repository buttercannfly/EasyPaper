import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.BASE_URL,
  dangerouslyAllowBrowser: true,
});

export async function chatCompletion(message: string) {
  console.log(message);
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "你是一个论文助手,可以辅助写作毕业论文。以中文作答。",
      },
      {
        role: "user",
        content: message,
      },
    ],
    model: "gpt-3.5-turbo-16k-0613",
    max_tokens: 16000,
  });
  return completion.choices[0].message.content ?? "empty";
}
