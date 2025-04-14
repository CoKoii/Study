import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
});

export const renderMarkdown = (content: string): string => {
  if (!content) return "";
  return md.render(content);
};

export default md;
