import { jsonCorrection } from "./verify";

export async function checkJsonAndRetry(
  message: string,
  format: object
): Promise<string> {
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    try {
      JSON.parse(message);
      return message; // 如果 message 是有效的 JSON，直接返回
    } catch (error) {
      attempts++;
      console.log(`JSON 格式错误，正在进行第 ${attempts} 次修正...`);
      message = await jsonCorrection(message, format);
    }
  }

  throw new Error("经过多次尝试，仍无法将 message 转换为有效的 JSON 格式。");
}
