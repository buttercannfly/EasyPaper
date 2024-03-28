// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { chatCompletion } from "@/lib/utils";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  result: string;
  result2: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { mainTitle, abstract } = req.body;

    const reply = await chatCompletion(
      "这是本文的标题：<" +
        mainTitle +
        ">, 这是本文的摘要: <" +
        abstract +
        ">, 请你列举本文可以参考的论文，包含中英文论文." +
        "请遵循下面的JSON数组格式进行返回. 请确保返回条数不少于10条, 只包含英文文献." +
        '[{"name": "", "authors": "", "year": ""}]'
    );
    const reply_chinese = await chatCompletion(
      "这是本文的标题：<" +
        mainTitle +
        ">, 这是本文的摘要: <" +
        abstract +
        ">, 请你列举本文可以参考的论文，包含中英文论文." +
        "请遵循下面的JSON数组格式进行返回. 请确保返回条数不少于10条,只包含中文文献." +
        '[{"name": "", "authors": "", "year": ""}]'
    );
    res.status(200).json({ result: reply, result2: reply_chinese });
  }
}
