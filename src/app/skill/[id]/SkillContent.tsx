"use client";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

interface SkillContentProps {
  content: string;
}

export default function SkillContent({ content }: SkillContentProps) {
  return (
    <div className="prose-dark">
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
