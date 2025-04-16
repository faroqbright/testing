interface TextNode {
  text: string;
  type: string;
}

interface ParagraphNode {
  type: string;
  children: TextNode[];
}
interface Content {
  content: ParagraphNode[];
}

export const parseContent = (content: ParagraphNode[]): JSX.Element[] => {
  return content.map((paragraph, index) => (
    <p className="text-justify tracking-wide leading-8" key={index}>
      {paragraph.children.map((child, childIndex) => (
        <span key={childIndex}>{child.text}</span>
      ))}
    </p>
  ));
};

export const getFirstThreeParagraphsText = (content: Content): string => {
  const paragraphs = content.content.slice(0, 3); // Get the first three paragraphs
  const text = paragraphs.map((paragraph) => paragraph.children.map((child) => child.text).join(" ")).join(" ");

  return text;
};
