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
    const { mainTitle, desc, title, count, abstract } = req.body;
    const sample_json = [
      { title: "paragraph_title", content: "paragraph: content" },
      { title: "paragraph_title", content: "paragraph: content" },
      { title: "paragraph_title", content: "paragraph: content" },
    ];

    const reply = await chatCompletion(
      "这是本文的标题：<" +
        mainTitle +
        ">, 这是本文的摘要: <" +
        abstract +
        ">, 请你完成小节: <" +
        title +
        ">的书写， 该小节的描述是" +
        desc +
        "。结果保证以多段内容返回。有以下请您务必遵守。" +
        "1. 请保证结果以下面样例JSON数组格式返回: " +
        JSON.stringify(sample_json) +
        ". 每一个元素代表一段的内容。" +
        "2. 请严格要求返回格式为JSON数组." +
        "并且请严格要求回复字数不少于 " +
        count +
        "字!!!" +
        ", 请严格要求回复字数不少于 " +
        count +
        "字!!!" +
        ", 请严格要求回复字数不少于 " +
        count +
        "字!!!" +
        "3. 请每一段直接返回内容,不需要段落名,不要作任何标注和解释."
    );
    const result = await checkJsonAndRetry(reply, sample_json);
    res.status(200).json({ result });
  }
}
