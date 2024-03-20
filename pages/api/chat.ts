// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.BASE_URL,
  dangerouslyAllowBrowser: true,
});

type Data = {
  result: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { message } = req.body;

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
    model: "gpt-3.5-turbo",
  });
  res
    .status(200)
    .json({ result: completion.choices[0].message.content ?? "empty" });
}
