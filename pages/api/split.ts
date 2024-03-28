// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { checkJsonAndRetry } from "@/lib/retry";
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
    const format = [{ part_name: "", desc: "", count: 200 }];

    const reply = await chatCompletion(
      "这是本节的标题：<" +
        title +
        ">, 本节描述为<" +
        desc +
        "> 目前本节要求字数多于" +
        count +
        "字. 请你拆分成2-6个小节, 保证每小节字数小于1000即可. 必须保证总字数, 也即count之和大于" +
        count +
        "字." +
        "请保证回复以满足JSON格式,样例返回JSON为: " +
        JSON.stringify(format)
    );
    const result = await checkJsonAndRetry(reply, format);
    res.status(200).json({ result });
  }
}
