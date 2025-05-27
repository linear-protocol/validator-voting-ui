import './index.css';

import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import RehypeHighlight from 'rehype-highlight';
import RehypeRaw from 'rehype-raw';
import RemarkBreaks from 'remark-breaks';
import RemarkGfm from 'remark-gfm';

export interface MarkdownProps {
  content: string;
}

function escapeBrackets(text: string) {
  const pattern = /(```[\s\S]*?```|`.*?`)|\\\[([\s\S]*?[^\\])\\\]|\\\((.*?)\\\)/g;
  return text.replace(pattern, (match, codeBlock, squareBracket, roundBracket) => {
    if (codeBlock) {
      return codeBlock;
    } else if (squareBracket) {
      return `$$${squareBracket}$$`;
    } else if (roundBracket) {
      return `$${roundBracket}$`;
    }
    return match;
  });
}

function tryWrapHtmlCode(text: string) {
  if (text.includes('```')) {
    return text;
  }
  return text
    .replace(/([`]*?)(\w*?)([\n\r]*?)(<!DOCTYPE html>)/g, (match, quoteStart, doctype) => {
      return !quoteStart ? '\n```html\n' + doctype : match;
    })
    .replace(
      /(<\/body>)([\r\n\s]*?)(<\/html>)([\n\r]*)([`]*)([\n\r]*?)/g,
      (match, bodyEnd, space, htmlEnd, quoteEnd) => {
        return !quoteEnd ? bodyEnd + space + htmlEnd + '\n```\n' : match;
      },
    );
}

export default function Markdown({ content }: MarkdownProps) {
  const escapedContent = useMemo(() => {
    return tryWrapHtmlCode(escapeBrackets(content));
  }, [content]);

  return (
    <div className="markdown-container">
      <ReactMarkdown
        remarkPlugins={[RemarkGfm, RemarkBreaks]}
        rehypePlugins={[
          RehypeRaw,
          [
            RehypeHighlight,
            {
              detect: false,
              ignoreMissing: true,
            },
          ],
        ]}
        components={{
          code: (cProps) => (
            <code
              style={{
                overflowY: 'hidden',
              }}
              {...cProps}
            />
          ),
          p: (pProps) => <p {...pProps} dir="auto" />,
        }}
      >
        {escapedContent}
      </ReactMarkdown>
    </div>
  );
}
