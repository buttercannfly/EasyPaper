// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { chatCompletion } from "../utils/chat";

type Data = {
  result: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { abstract, desc, title, count } = req.body;

  const reply = await chatCompletion(
    "这是本文的摘要：<" +
      abstract +
      ">, 请你完成小节: " +
      title +
      "的书写， 该小节的描述是" +
      desc +
      ", 要求小节字数大约" +
      count
  );
  res.status(200).json({ result: reply });
}
