import React, { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";


const AiWritingForm = () => {
  const [topic, setTopic] = useState("");
  const [outline, setOutline] = useState("");
  const [abstract, setAbstract] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateOutline = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "请为以下论文题目生成1000字的大纲, <" + topic + ">",
        }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const { result } = await response.json();
      setOutline(result);
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };
  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-2">神笔AI写作</h2>
      <p className="text-gray-500 mb-8">300万大学生都在用的AI写作平台</p>

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
          <span className="text-gray-700 font-bold">编辑大纲</span>
        </div>
        <div className="ml-4">
          <TextareaAutosize
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={4}
            placeholder="生成论文初稿专业"
            value={outline}
            onChange={(e) => setOutline(e.target.value)}
          ></TextareaAutosize>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
          <span className="text-gray-700 font-bold">生成全文</span>
        </div>
        <div className="ml-4">
          <label className="flex items-center mb-2">
            <input
              type="radio"
              className="form-radio text-purple-500 mr-2"
              name="generation"
            />
            <span>专科</span>
          </label>
          <label className="flex items-center mb-2">
            <input
              type="radio"
              className="form-radio text-purple-500 mr-2"
              name="generation"
            />
            <span>本科</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              className="form-radio text-purple-500 mr-2"
              name="generation"
            />
            <span>研究生博士</span>
          </label>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
          <span className="text-gray-700 font-bold">下载论文</span>
        </div>
      </div>

      <button
        className="w-full bg-purple-500 text-white font-bold py-2 px-4 rounded-full hover:bg-purple-600 focus:outline-none"
        onClick={handleGenerateOutline}
      >
        {loading ? "正在生成..." : "10秒生成大纲"}
      </button>
      <p className="text-gray-500 text-sm mt-2 text-center">自动生成大纲</p>
    </div>
  );
};

export default AiWritingForm;