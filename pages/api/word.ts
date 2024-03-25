import { IOutline } from "@/type";
import type { NextApiRequest, NextApiResponse } from "next";
import * as docx from "docx";
import { Document, ISectionOptions, Paragraph, TextRun } from "docx";
import * as fs from "fs";

type Data = {
  result: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { jsonStr, title } = req.body;
    const paper: IOutline[] = JSON.parse(jsonStr);
    const sections: ISectionOptions[] = [];

    paper.forEach((chapter, index) => {
      // 添加章节标题
      sections.push({
        properties: {},
        children: [
          new docx.Paragraph({
            text: chapter.chapter_name,
            heading: docx.HeadingLevel.HEADING_1,
          }),
        ],
      });

      // 遍历章节内容并添加到文档中
      chapter.content.forEach((section) => {
        sections.push({
          properties: {},
          children: [
            new docx.Paragraph({
              text: section.section_name,
              heading: docx.HeadingLevel.HEADING_2,
            }),
            new docx.Paragraph({
              text: section.description,
            }),
            new docx.Paragraph({
              text: section.content || "",
            }),
          ],
        });
      });

      // 如果不是最后一章,添加分页符
      //   if (index < paper.length - 1) {
      //     sections.push({
      //       properties: {},
      //       children: [
      //         new docx.PageBreak({
      //           break: docx.PageBreakType.PAGE,
      //         }),
      //       ],
      //     });
      //   }
    });
    const doc = new Document({
      sections,
    });

    docx.Packer.toBuffer(doc).then((buffer) => {
      fs.writeFileSync(title + ".docx", buffer);
    });
    res.status(200).json({ result: "success" });
  }
}
