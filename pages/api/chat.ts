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
  const { message } = req.body;

  const reply = await chatCompletion(message);
  res.status(200).json({ result: reply });
}
