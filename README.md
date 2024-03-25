# EasyPaper

EasyPaper is an open source project designed to simplify the academic writing process. Whether you are writing a thesis, journal article, or laboratory report, EasyPaper can provide you with the tools and resources you need to help you improve your writing efficiency and achieve higher writing efficiency and high-quality academic articles.

## Basic Features

- [x] 生成大纲
- [x] 生成中英文摘要
- [x] 生成正文
- [ ] 生成参考文献
- [ ] 引用
- [ ] 生成中英文文献综述
- [ ] 插入图表

## Advanced Features

- [ ] 思维导图
- [ ] 答辩 PPT
- [ ] 论文润色
- [ ] 论文去重

## 贡献指南

## Key issues

- How to make chatgpt write longer ?

  > Limit the maximum of response is easy, just limit the parameter _max_tokens_ to achieve that.

  > However, when you want Chatgpt write more (2000 words? 5000 words?) at once. It becomes a problem.

Resolved: When we need to write context longer than 1000 words, we will the task split into several subtasks.

- Stable Json Output ?

  > When you ask Chatgpt to give a JSON response, it randomly returns a bad JSON and it can't be parsed.

Resolved: When we need a JSON response, we will verify the JSON again and enable a retry method. Besides, some models support only respond with JSON objects. For us, we use the gpt-3.5-turbo-16k-0613, it doesn't support.

## 免责声明

- 本项目提供的写作辅助服务仅供参考,不能代替用户自己的思考和创作。我们生成的内容可能存在错误、偏差或不适用的情况。用户在使用我们的服务时,应独立判断并对最终提交的论文内容负责。
- 本项目生成的内容不能保证完全满足用户所在学术机构或出版物的要求。用户应该根据具体要求对生成的内容进行必要的修改、补充和完善。
- 本项目不对用户使用我们的服务所产生的任何后果负责,包括但不限于学术不诚信、论文被拒、版权纠纷等。用户应该遵守所在国家/地区和学术机构的相关法律法规和学术道德规范。

本免责声明之解释权与修改权属于本网站。如有任何疑问,请联系我们的客服。
请您知悉并理解,使用我们的服务即表示您已经完全接受上述免责声明的全部内容。如果您不同意免责声明的任何条款,请勿使用本网站的服务。
