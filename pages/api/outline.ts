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
    const { topic, abs } = req.body;
    const sample_json = [
      {
        chapter_name: "章标题一",
        content: [
          {
            section_name: "小节标题",
            description: "小节描述",
            word_count: 400,
          },
          {
            section_name: "小节标题",
            description: "小节描述",
            word_count: 500,
          },
        ],
      },
      {
        chapter_name: "章标题二",
        content: [
          {
            section_name: "小节标题",
            description: "小节描述",
            word_count: 800,
          },
          {
            section_name: "小节标题",
            description: "小节描述",
            word_count: 600,
          },
        ],
      },
    ];

    const reply = await chatCompletion(
      "你现在要写一篇总字数两万字的论文,请先为以下论文题目生成论文大纲, 并且安排好各个小节的字数以满足总字数两万以上的要求, <" +
        topic +
        ">, 摘要为<" +
        abs +
        ">。 请注意,我只需要你返回 JSON数组格式的结果!! 注意满足JSON数组格式!!注意满足JSON数组格式!! 注意满足JSON数组格式!!不要添加任何解释、说明或评论。请严格按照以下JSON返回结果。确保work_count之和大于两万。" +
        "." +
        JSON.stringify(sample_json) +
        "请保证有多个chapter,也请确保某个section_name为中内外研究现状!"
    );
    const result = await checkJsonAndRetry(reply, sample_json);
    res.status(200).json({ result });
  }
}
