import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.BASE_URL,
  dangerouslyAllowBrowser: true,
});

export async function jsonCorrection(message: string, format: object) {
  console.log(message);
  console.log(format);
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "假设你是一个JSON专家, 能够验证JSON格式, 根据要求纠正JSON。" +
          "回答过程请保持以下几点原则:" +
          "1. 保证回复是JSON格式, 严格按照用户要求的JSON格式" +
          "2. 严格按照要求的格式进行输出" +
          "3. 不要添加任何解释、说明、标注字数或评论",
      },
      {
        role: "user",
        content:
          "请将下面这个用<>包起来的错误JSON: <" +
          message +
          ">, 目标格式是 " +
          format,
      },
    ],
    model: "gpt-3.5-turbo-16k-0613",
    max_tokens: 14000,
  });
  return completion.choices[0].message.content ?? "empty";
}
