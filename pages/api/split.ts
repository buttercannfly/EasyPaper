// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { chatCompletion } from "@/lib/utils";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  result: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { title, count, desc } = req.body;

    const reply = await chatCompletion(
      "这是本节的标题：<" +
        title +
        ">, 本节描述为<" +
        desc +
        "> 目前本节要求字数多于" +
        count +
        "字. 请你拆分成不超过三个小节, 保证每小节字数小于1000即可. " +
        "请保证回复以满足JSON格式,样例返回JSON为 " +
        '[{"part_name": "", "desc": "", "count": 200}]'
    );
    console.log(reply);
    res.status(200).json({ result: reply });
  }
}
