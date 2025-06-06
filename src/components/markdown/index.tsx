import './index.css';

import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { useCopyToClipboard } from 'react-use';
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
  const [, copy] = useCopyToClipboard();

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
            <div className="markdown-code-block relative group">
              <code
                style={{
                  overflowY: 'hidden',
                }}
                {...cProps}
              />
              <div
                className="hidden group-hover:flex cursor-copy absolute top-2 right-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                onClick={(ev) => {
                  ev.stopPropagation();
                  if (!cProps.children) return;
                  try {
                    const target = ev.target as HTMLElement;
                    const block = target.closest('.markdown-code-block');
                    if (!block) return;
                    const code = block.querySelector('code');
                    if (!code) return;
                    const codeText = code.textContent || '';
                    if (!codeText) return;
                    copy(codeText);
                  } catch (error) {
                    console.error('Failed to copy code:', error);
                  }
                }}
              >
                Copy
              </div>
            </div>
          ),
          p: (pProps) => <p {...pProps} dir="auto" />,
        }}
      >
        {escapedContent}
      </ReactMarkdown>
    </div>
  );
}
