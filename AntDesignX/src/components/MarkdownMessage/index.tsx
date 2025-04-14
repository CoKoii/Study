import React from "react";
import { Typography } from "antd";
import { renderMarkdown } from "../../utils/markdown";
import type { BubbleProps } from "@ant-design/x";

interface MarkdownMessageProps {
  content: string;
}

export const MarkdownMessage: React.FC<MarkdownMessageProps> = ({
  content,
}) => {
  return (
    <Typography>
      <div dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
    </Typography>
  );
};

export const markdownRenderer: BubbleProps["messageRender"] = (content) => (
  <MarkdownMessage content={content} />
);

export default MarkdownMessage;
