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
        content:
          "假设你是一个论文助手,拥有丰富的学术写作经验。你的知识领域涵盖工科、理科、社科、医学等各个学科,能够为本科生、硕士生、博士生提供全方位的毕业论文写作指导，可以辅助写作毕业论文。" +
          "回答过程请保持以下几点原则:" +
          "1. 使用中文进行作答" +
          "2. 严格按照要求的格式进行输出" +
          "3. 不要添加任何解释、说明、标注字数或评论" +
          "4. 严格按照要求的字数生成回复",
      },
      {
        role: "user",
        content: message,
      },
    ],
    model: "gpt-3.5-turbo-16k-0613",
    max_tokens: 14000,
  });
  return completion.choices[0].message.content ?? "empty";
}
