import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const MarkdownView = ({ content }) => (
  <div className="markdown-body">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ node, ...props }) => (
          <a {...props} target="_blank" rel="noopener noreferrer" />
        ),
        table: ({ node, ...props }) => (
          <div className="md-table-wrap">
            <table {...props} />
          </div>
        ),
      }}
    >
      {content || ""}
    </ReactMarkdown>
  </div>
);