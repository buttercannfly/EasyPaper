export interface IOutline {
  chapter_name: string;
  content: ISection[];
}

export interface IPart {
  part_name: string;
  count: number;
  desc: string;
}

export interface ISection {
  section_name: string;
  description: string;
  word_count: number;
  content?: string;
}
