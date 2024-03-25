import { IOutline, IPart } from "@/type";
import React, { useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

interface IAbstract {
  abstract: string;
  keywords: string[];
}

const AiWritingForm = () => {
  const [topic, setTopic] = useState("");
  const [outline, setOutline] = useState<IOutline[]>([]);
  const [show_outline, setShowOutline] = useState<string>("");
  const [showDownload, setDownload] = useState<boolean>(false);
  const [abstract, setAbstract] = useState<IAbstract>({
    abstract: "",
    keywords: [],
  });

  const [abs, setAbs] = useState<string>("");
  useEffect(() => {
    setAbs(abstract.abstract);
    console.log("change abstract");
  }, [abstract]);

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);

  const handleGenerateOutline = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message:
            "请为以下论文题目生成摘要,  <" +
            topic +
            ">, 不要添加任何解释、说明或评论。请严格按照以下两个要求进行回复" +
            "1. 生成字数至少300字" +
            "2. 请严格按照以下JSON返回结果" +
            ' {"abstract":"", "keywords":[] }' +
            "3. 保证结果符合JSON格式定义",
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }
      const result = await response.json();

      const json: IAbstract = JSON.parse(result.result);

      console.log(json);
      setAbstract({
        ...abstract,
        abstract: json.abstract,
        keywords: json.keywords,
      });
    } catch (error) {
      console.error("Error:", error);
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message:
            "你现在要写一篇总字数两万字的论文,请先为以下论文题目生成1000字的大纲, 包含中内外研究现状, 并且安排好各个小节的字数以满足总字数两万以上的要求, <" +
            topic +
            ">, 摘要为<" +
            abs +
            ">。 请注意,我只需要你返回 JSON数组格式的结果!! 注意满足JSON数组格式!!注意满足JSON数组格式!! 注意满足JSON数组格式!!不要添加任何解释、说明或评论。请严格按照以下JSON返回结果。确保work_count之和大于两万。" +
            '[{"chapter_name": "章标题","content": [{"section_name": "小节标题", "description": "小节描述", "word_count": 400}]}, {"section_name": "小节标题", "description": "小节描述", "word_count": 500}]} ].',
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const { result } = await response.json();
      const outline_json: IOutline[] = JSON.parse(result);
      var text = "";
      for (const chapter of outline_json) {
        const name = chapter.chapter_name;
        text += name + "\n";
        for (const section of chapter.content) {
          text += "  - " + section.section_name + "\n";
          text += "     - " + section.description + "\n";
        }
      }
      setShowOutline(text);
      setOutline(outline_json);
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  const generateSection = async (
    mainTitle: string,
    desc: string,
    title: string,
    count: number
  ) => {
    try {
      const response = await fetch("/api/section", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mainTitle,
          desc,
          title,
          count,
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }
      const { result } = await response.json();
      return result;
      setContent((prevContent) => prevContent + result + "\\n\\n\\n");
    } catch (error) {
      console.error("Error:", error);
      return "";
    }
  };

  const handlePaperContent = async () => {
    setLoadingAll(true);

    for (const chapter of outline) {
      const name = chapter.chapter_name;
      for (const section of chapter.content) {
        if (section.word_count <= 1000) {
          console.log("below 1000");
          console.log(section);
          const section_content = await generateSection(
            topic,
            section.description,
            section.section_name,
            section.word_count
          );
          section.content = section_content;
        } else {
          console.log("beyond 1000");
          console.log(section);
          const response = await fetch("/api/split", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: section.section_name,
              desc: section.description,
              count: section.word_count,
            }),
          });
          if (!response.ok) {
            throw new Error("API request failed");
          }
          const { result } = await response.json();
          const parts_result: IPart[] = JSON.parse(result);
          var content_multiple_parts = "";
          for (const part of parts_result) {
            console.log(part);
            const res = await generateSection(
              topic,
              part.desc,
              part.part_name,
              part.count
            );
            content_multiple_parts += res + "\n";
          }
          section.content = content_multiple_parts;
        }
      }
    }
    await fetch("/api/word", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: topic,
        jsonStr: JSON.stringify(outline),
      }),
    });
    setLoadingAll(false);
    setDownload(true);
  };

  const downloadPaper = async () => {
    try {
      // 发送 API 请求获取文件
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: topic }),
      });
    } catch (error) {
      console.error("下载文件出错:", error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-2">EasyPaper</h2>
      <p className="text-gray-500 mb-8">AI thesis, paper, report</p>

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
          <span className="text-gray-700 font-bold">输入论文题目</span>
        </div>
        <div className="ml-4">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="生成千字大纲"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
          <span className="text-gray-700 font-bold">摘要</span>
        </div>
        <div className="ml-4">
          <TextareaAutosize
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={4}
            placeholder="摘要"
            value={abs}
            onChange={(e) =>
              setAbstract({
                ...abstract,
                abstract: e.target.value,
              })
            }
          ></TextareaAutosize>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
          <span className="text-gray-700 font-bold">编辑大纲</span>
        </div>
        <div className="ml-4">
          <TextareaAutosize
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={4}
            placeholder="大纲"
            value={show_outline}
            disabled
            onChange={(e) => setShowOutline(e.target.value)}
          ></TextareaAutosize>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
          <span className="text-gray-700 font-bold">论文全文</span>
        </div>
        <div className="ml-4">
          <TextareaAutosize
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={4}
            placeholder="全文"
            value={content}
            disabled
            // onChange={(e) => setContent(e.target.value)}
          ></TextareaAutosize>
        </div>
      </div>

      <button
        className="w-full bg-purple-500 text-white font-bold py-2 px-4 rounded-full hover:bg-purple-600 focus:outline-none"
        onClick={handleGenerateOutline}
      >
        {loading ? "正在生成..." : "10秒生成大纲&摘要"}
      </button>
      <button
        className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-full hover:bg-green-600 focus:outline-none mt-4"
        onClick={handlePaperContent}
      >
        {loadingAll ? "正在生成..." : "生成全文"}
      </button>
      {!loadingAll && (
        <button
          className="block w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-600 focus:outline-none mt-4 text-center"
          onClick={downloadPaper}
        >
          Download Paper
        </button>
      )}
    </div>
  );
};

export default AiWritingForm;
