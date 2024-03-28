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
    const { topic } = req.body;
    const sample_json = { abstract: "", keywords: [] };

    const reply = await chatCompletion(
      "请为以下论文题目生成摘要,  <" +
        topic +
        ">, 不要添加任何解释、说明或评论。请严格按照以下两个要求进行回复" +
        "1. 生成字数至少300字" +
        "2. 请严格按照以下JSON返回结果" +
        sample_json +
        "3. 保证结果符合JSON格式定义"
    );
    const result = await checkJsonAndRetry(reply, sample_json);
    res.status(200).json({ result });
  }
}
